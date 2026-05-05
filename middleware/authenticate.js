const jwt = require('jsonwebtoken');
const { User } = require('../models');

/**
 * Middleware de autenticación JWT
 * Verifica que el request contenga un token válido en el header Authorization.
 * Si es válido, adjunta el usuario autenticado a req.user.
 */
const authenticate = async (req, res, next) => {
  try {
    // 1. Extraer el token del header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    // 2. Verificar y decodificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 3. Buscar el usuario en la base de datos
    const user = await User.findByPk(decoded.id, {
      attributes: { exclude: ['passwordHash'] }
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
