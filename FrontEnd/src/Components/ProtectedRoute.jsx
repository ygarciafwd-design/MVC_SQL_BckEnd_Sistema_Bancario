import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

/**
 * ProtectedRoute — wraps a page element.
 *  - If not authenticated → redirect to /login
 *  - If requiredRole is specified and user doesn't have it → redirect to /
 */
const ProtectedRoute = ({ children, requiredRole }) => {
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

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
