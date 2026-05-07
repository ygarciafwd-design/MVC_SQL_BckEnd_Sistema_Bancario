import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

/**
 * ProtectedRoute — wraps a page element.
 *  - If not authenticated → redirect to /login
 *  - If allowedRoles is specified and user doesn't have one of them → redirect to /
 */
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // allowedRoles can be a single string or an array of strings
  if (allowedRoles) {
    const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
    if (!rolesArray.includes(user.role)) {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
