const mongoose = require('mongoose');

/**
 * Establishes connection to MongoDB.
 * Uses connection string from environment variables.
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    // Log only connection host, not the full URI (may contain credentials)
    const host = conn.connection.host;
    if (process.env.NODE_ENV !== 'test') {
      console.log(`MongoDB connected: ${host}`);
    }
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
