const mongoose = require("mongoose");

let connectionPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 10000,
        family: 4,
      })
      .then((conn) => {
        console.log("✅ MongoDB Connected!");
        console.log("Host:", conn.connection.host);
        console.log("Database:", conn.connection.name);
        return conn.connection;
      })
      .catch((error) => {
        console.error("⚠️ MongoDB connection failed:", error.message);
        connectionPromise = null;
        return null;
      });
  }

  return connectionPromise;
};

module.exports = connectDB;