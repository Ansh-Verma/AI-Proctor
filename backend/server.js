const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const examRoutes = require('./routes/examRoutes');
const userRoutes = require('./routes/userRoutes');
const examResponseRoutes = require('./routes/examResponseRoutes');

// Mount routes
app.use('/api/exams', examRoutes);
app.use('/api/users', userRoutes);
app.use('/api/exam-responses', examResponseRoutes);

// Basic Test Route
app.get('/', (req, res) => {
  res.send('API is working!');
});

// MongoDB Connection
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
