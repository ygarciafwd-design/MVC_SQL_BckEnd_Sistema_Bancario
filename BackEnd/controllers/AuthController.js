const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { User, Role } = require('../models');

class AuthController {
  /**
   * User login
   * Authenticates user and returns a JWT token via httpOnly cookie.
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      // 1. Validate input
      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
      }

      // 2. Find user by email
      const user = await User.findOne({ 
        where: { email },
        include: [{ model: Role, as: 'role' }]
      });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 3. Verify password
      const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // 4. Check status
      if (user.status !== 'active') {
        return res.status(403).json({ message: 'Account is not active' });
      }

      // 5. Generate token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role.name },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
      );

      // 6. Set token in httpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,               // Not accessible via JavaScript (XSS protection)
        secure: process.env.NODE_ENV === 'production',  // HTTPS only in production
        sameSite: 'lax',              // CSRF protection
        maxAge: 60 * 60 * 1000,       // 1 hour (matches JWT_EXPIRES_IN)
        path: '/'
      });

      // 7. Return response (token also in body for flexibility)
      res.json({
        message: 'Login successful',
        token,
        user: {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role.name
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * User registration (public)
   * Creates a new user account with default role 'client'
   */
  static async register(req, res) {
    try {
      const { firstName, lastName, email, password, identityDocument } = req.body;

      // 1. Validate all required fields
      if (!firstName || !lastName || !email || !password || !identityDocument) {
        return res.status(400).json({ message: 'All fields are required: firstName, lastName, email, password, identityDocument' });
      }

      // 2. Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
      }

      // 3. Validate password strength
      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters' });
      }

      // 4. Check if user already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(409).json({ message: 'A user with this email already exists' });
      }

      // 5. Get default role 'client'
      const role = await Role.findOne({ where: { name: 'client' } });
      if (!role) {
        return res.status(500).json({ message: 'Default role not found. Contact administrator.' });
      }

      // 6. Hash password
      const passwordHash = await bcrypt.hash(password, 12);

      // 7. Create user
      const newUser = await User.create({
        firstName,
        lastName,
        email,
        passwordHash,
        identityDocument,
        role_id: role.id,
        status: 'active'
      });

      res.status(201).json({
        message: 'User registered successfully',
        user: {
          id: newUser.id,
          firstName: newUser.firstName,
          lastName: newUser.lastName,
          email: newUser.email
        }
      });
    } catch (error) {
      // Handle Sequelize validation errors
      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(e => e.message);
        return res.status(400).json({ message: messages.join(', ') });
      }
      if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(409).json({ message: 'Email or identity document already exists' });
      }
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * User logout
   * Clears the JWT cookie
   */
  static async logout(req, res) {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
      });
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  /**
   * Get current user profile
   * Returns the authenticated user's data (requires auth middleware)
   */
  static async getProfile(req, res) {
    try {
      res.json({
        user: {
          id: req.user.id,
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          phone: req.user.phone,
          identityDocument: req.user.identityDocument,
          status: req.user.status,
          role: req.user.role.name,
          createdAt: req.user.createdAt
        }
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
}

module.exports = AuthController;
