const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
require('dotenv').config();

const db = require('./models');

// Route Imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const accountRoutes = require('./routes/accountRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Services
const { initializeDatabase } = require('./services/dbInitializer');



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Banking System API' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/accounts', accountRoutes);
app.use('/api/transactions', transactionRoutes);


// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
