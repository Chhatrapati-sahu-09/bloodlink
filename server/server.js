const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// Enable CORS for cross-origin requests (allows frontend to communicate with backend)
app.use(cors());

// Parse incoming JSON payloads in request bodies
app.use(express.json());

// Health check route to verify server status
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// Auth routes
app.use('/api/auth', require('./routes/auth'));

// Donor routes
app.use('/api/donors', require('./routes/donor'));

// Patient routes
app.use('/api/patients', require('./routes/patient'));

// Blood bank routes
app.use('/api/bloodbank', require('./routes/bloodBank'));

// Inventory routes
app.use('/api/inventory', require('./routes/inventory'));

// Request routes
app.use('/api/requests', require('./routes/requestRoutes'));

// Admin routes
app.use('/api/admin', require('./routes/admin'));

// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Handle MongoDB connection errors
mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Global error handling middleware (catches and handles unhandled errors)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
console.log('PORT from env:', process.env.PORT);
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));