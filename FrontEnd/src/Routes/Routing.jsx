import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../Components/Layout';
import ProtectedRoute from '../Components/ProtectedRoute';
import HomePage from '../Pages/Homepage/HomePage';
import LoginPage from '../Pages/LoginPage/LoginPage';
import RegisterPage from '../Pages/RegisterPage/RegisterPage';
import AdminDashboard from '../Pages/Admin/AdminDashboard';
import UserManagement from '../Pages/Admin/UserManagement';
import RoleManagement from '../Pages/Admin/RoleManagement';

function Routing() {
    return (
        <Router>
            <Routes>
                <Route path='/' element={<Layout />}>
                    {/* Public routes */}
                    <Route index element={<HomePage />} />
                    <Route path='login' element={<LoginPage />} />
                    <Route path='register' element={<RegisterPage />} />

                    {/* Admin routes (protected: requires auth + admin role) */}
                    <Route path='admin' element={
                        <ProtectedRoute requiredRole="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    } />
                    <Route path='admin/users' element={
                        <ProtectedRoute requiredRole="admin">
                            <UserManagement />
                        </ProtectedRoute>
                    } />
                    <Route path='admin/roles' element={
                        <ProtectedRoute requiredRole="admin">
                            <RoleManagement />
                        </ProtectedRoute>
                    } />
                </Route>
            </Routes>
        </Router>
    );
}

export default Routing;