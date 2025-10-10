import mongoose from 'mongoose';

// Configure mongoose defaults
mongoose.set('strictQuery', false);

const DEFAULT_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function connectDB(uri, { retries = DEFAULT_RETRIES } = {}) {
  if (!uri) {
    console.warn('No MONGO_URI provided, skipping MongoDB connection.');
    return;
  }

  let attempts = 0;
  while (attempts <= retries) {
    try {
      // Use recommended connection options; newer mongoose versions ignore legacy flags
      await mongoose.connect(uri, {
        // connection options can be added here if needed
      });

      console.log('MongoDB connected');

      mongoose.connection.on('error', err => {
        console.error('MongoDB connection error:', err);
      });
      mongoose.connection.on('disconnected', () => {
        console.warn('MongoDB disconnected');
      });

      // graceful shutdown
      process.on('SIGINT', async () => {
        await disconnectDB();
        process.exit(0);
      });

      return mongoose.connection;
    } catch (err) {
      attempts += 1;
      console.warn(`MongoDB connection attempt ${attempts} failed: ${err.message}`);
      if (attempts > retries) {
        console.error('Exceeded MongoDB connection retries.');
        throw err;
      }
      await wait(RETRY_DELAY_MS);
    }
  }
}

export async function disconnectDB() {
  try {
    await mongoose.disconnect();
    console.log('MongoDB connection closed');
  } catch (err) {
    console.error('Error while disconnecting MongoDB:', err.message);
  }
}

export default {
  connectDB,
  disconnectDB,
};
