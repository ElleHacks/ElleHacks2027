const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB connected");
    console.log(`📊 Database: ${conn.connection.name}`);
    console.log(`📍 Host: ${conn.connection.host}`);
    
    // Set up connection event listeners
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB');
    });
    
    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err);
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ Mongoose disconnected from MongoDB');
    });
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    console.error("🔧 Make sure your MONGODB_URI in .env is correct");
    process.exit(1);
  }
};

module.exports = connectDB;