import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || '';

const connectMongo = async () => {
  if (mongoose.connection.readyState === 1) return;

  try {
    await mongoose.connect(MONGODB_URI, {
      dbName: 'kontrakanAAdb',
    });
    console.log('✅ MongoDB connected');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    throw error;
  }
};

export default connectMongo;
