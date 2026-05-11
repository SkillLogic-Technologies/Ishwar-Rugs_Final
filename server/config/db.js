import mongoose from "mongoose";

const connectDB = async () => {
  const maxRetries = 5;
  let retries = 0;

  const attemptConnection = async () => {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 60000,
        socketTimeoutMS: 90000,
        connectTimeoutMS: 60000,
        family: 4,
      });
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return true;
    } catch (error) {
      retries++;
      console.error(`❌ MongoDB Attempt ${retries}/${maxRetries}: ${error.message}`);

      if (retries < maxRetries) {
        const waitTime = 2000 * retries;
        console.log(`⏳ Retrying in ${waitTime/1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        return attemptConnection();
      } else {
        console.log("⚠️ MongoDB connection failed. Server running in fallback mode.");
        return false;
      }
    }
  };

  return attemptConnection();
};

export default connectDB;