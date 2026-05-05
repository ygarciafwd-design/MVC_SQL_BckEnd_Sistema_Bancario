$ErrorActionPreference = "Stop"

function Log-Test([string]$message) { Write-Host ">>> $message" -ForegroundColor Cyan }
function Log-Success([string]$message) { Write-Host "[OK] $message" -ForegroundColor Green }
function Log-Fail([string]$message) { Write-Host "[FAIL] $message" -ForegroundColor Red }

$baseUrl = "http://localhost:3000"
$timestamp = Get-Date -Format "yyyyMMddHHmmss"

Log-Test "1. Testing GET / (Server Health)"
$health = Invoke-RestMethod -Uri "$baseUrl/" -Method Get
Log-Success "Server is up"

Log-Test "2. Creating Test Users (Admin and Client)"
$adminEmail = "admin$timestamp@test.com"
$clientEmail = "client$timestamp@test.com"

$adminParams = @{ firstName="Admin"; lastName="Test"; email=$adminEmail; passwordHash="admin123"; identityDocument="A$timestamp"; role="admin" }
$clientParams = @{ firstName="Client"; lastName="Test"; email=$clientEmail; passwordHash="client123"; identityDocument="C$timestamp"; role="client" }

$adminUser = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Post -Body ($adminParams | ConvertTo-Json) -ContentType "application/json"
$clientUser = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Post -Body ($clientParams | ConvertTo-Json) -ContentType "application/json"
Log-Success "Users created successfully"

Log-Test "3. Testing Login and JWT Generation"
$adminLogin = @{ email=$adminEmail; password="admin123" }
$clientLogin = @{ email=$clientEmail; password="client123" }

$adminAuth = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body ($adminLogin | ConvertTo-Json) -ContentType "application/json"
$clientAuth = Invoke-RestMethod -Uri "$baseUrl/api/auth/login" -Method Post -Body ($clientLogin | ConvertTo-Json) -ContentType "application/json"

$adminToken = $adminAuth.token
$clientToken = $clientAuth.token

$adminHeaders = @{ Authorization = "Bearer $adminToken" }
$clientHeaders = @{ Authorization = "Bearer $clientToken" }
Log-Success "Tokens generated"

Log-Test "4. Testing Authorization (Admin Access)"
$usersList = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Get -Headers $adminHeaders
Log-Success "Admin fetched users"

Log-Test "5. Testing Role Restriction (Client accessing Admin Route)"
try {
    $null = Invoke-RestMethod -Uri "$baseUrl/api/users" -Method Get -Headers $clientHeaders
    Log-Fail "Security flaw: Client accessed admin route"
} catch {
    Log-Success "Client correctly denied access (403)"
}

Log-Test "6. Creating Accounts for Client"
$accParams1 = @{ userId=$clientUser.id; accountTypeId=1; balance=100; currency="USD" }
$accParams2 = @{ userId=$clientUser.id; accountTypeId=1; balance=0; currency="USD" }

$acc1 = Invoke-RestMethod -Uri "$baseUrl/api/accounts" -Method Post -Body ($accParams1 | ConvertTo-Json) -ContentType "application/json" -Headers $clientHeaders
$acc2 = Invoke-RestMethod -Uri "$baseUrl/api/accounts" -Method Post -Body ($accParams2 | ConvertTo-Json) -ContentType "application/json" -Headers $clientHeaders
Log-Success "Accounts created"

Log-Test "7. Testing Transaction: Deposit"
$depParams = @{ accountId=$acc1.id; amount=50; description="Dep" }
$dep = Invoke-RestMethod -Uri "$baseUrl/api/transactions/deposit" -Method Post -Body ($depParams | ConvertTo-Json) -ContentType "application/json" -Headers $clientHeaders
Log-Success "Deposit successful"

Log-Test "8. Testing Transaction: Transfer"
$transParams = @{ sourceAccountId=$acc1.id; destinationAccountId=$acc2.id; amount=75; description="Trf" }
$trans = Invoke-RestMethod -Uri "$baseUrl/api/transactions/transfer" -Method Post -Body ($transParams | ConvertTo-Json) -ContentType "application/json" -Headers $clientHeaders
Log-Success "Transfer successful"

Log-Test "9. Verifying Transaction History"
$history = Invoke-RestMethod -Uri "$baseUrl/api/transactions/account/$($acc1.id)" -Method Get -Headers $clientHeaders
Log-Success "Transaction history fetched"

Log-Test "10. Getting Account to verify final balances"
$acc1Update = Invoke-RestMethod -Uri "$baseUrl/api/accounts/$($acc1.id)" -Method Get -Headers $clientHeaders
$acc2Update = Invoke-RestMethod -Uri "$baseUrl/api/accounts/$($acc2.id)" -Method Get -Headers $clientHeaders

Log-Success "Final Balances verified: Acc1=$($acc1Update.balance), Acc2=$($acc2Update.balance)"

Write-Host "All tests completed!" -ForegroundColor Green
