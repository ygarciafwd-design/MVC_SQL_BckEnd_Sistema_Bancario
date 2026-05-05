/**
 * Middleware de autorización por roles.
 * Se usa DESPUÉS del middleware authenticate.
 * Recibe un array de roles permitidos y verifica si el usuario tiene uno de ellos.
 *
 * @param  {...string} allowedRoles - Roles que tienen acceso (ej: 'admin', 'client')
 * @returns {Function} Express middleware
 *
 * Ejemplo de uso:
 *   router.get('/admin-only', authenticate, authorize('admin'), controller.method);
 */
const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    // El middleware authenticate ya adjuntó req.user
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}. Your role: ${req.user.role}.`
      });
    }

    next();
  };
};

module.exports = authorize;
