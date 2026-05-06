import { AuthProvider } from "./services/AuthContext";
import Routing from "./Routes/Routing";

function App() {
  return (
    <AuthProvider>
      <Routing />
    </AuthProvider>
  );
}

export default App;
