const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const db = require('./models');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Services
const { initializeDatabase } = require('./services/dbInitializer');



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174'],
  credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test DB Connection & Initialize
db.sequelize.authenticate()
  .then(async () => {
    console.log('Database connected successfully.');
    // Run auto-seeding
    await initializeDatabase();
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });


// Routes
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Banking System API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}.`);
});
