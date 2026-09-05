require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const { notFoundHandler, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const boardRoutes = require('./routes/boardRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const settingsRoutes = require('./routes/settingsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/boards', boardRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/settings', settingsRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

if (require.main === module) {
  const startServer = () => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  };

  if (process.env.MONGO_URI) {
    mongoose
      .connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => {
        console.log('MongoDB connected successfully');
        startServer();
      })
      .catch((err) => {
        console.warn('MongoDB connection warning:', err.message);
        console.log('Continuing server with in-memory persistence fallback...');
        startServer();
      });
  } else {
    startServer();
  }
}

module.exports = app;
