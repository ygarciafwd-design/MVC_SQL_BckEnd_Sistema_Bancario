const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

/**
 * Middleware de autenticación JWT
 * Verifica que el request contenga un token válido.
 * 
 * Prioridad de lectura del token:
 *   1. Cookie httpOnly llamada "token"
 *   2. Header Authorization: Bearer <token>
 * 
 * Si es válido, adjunta el usuario autenticado a req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Intentar leer el token desde la cookie primero, luego del header
    let token = req.cookies?.token;

    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      }
    }

    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Buscar el usuario en la base de datos
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] },
      include: [{ model: Role, as: 'role' }]
    });

    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    // 4. Verificar que el usuario esté activo
    if (user.status !== 'active') {
      return res.status(403).json({ message: 'Account is not active. Contact support.' });
    }

    // 5. Adjuntar usuario al request
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token expired. Please login again.' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token.' });
    }
    return res.status(500).json({ message: 'Authentication error.', error: error.message });
  }
};

module.exports = authenticate;
