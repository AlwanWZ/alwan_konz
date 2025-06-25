// testMongo.js
import mongoose from 'mongoose';

const MONGODB_URI = 'mongodb+srv://alwanwildan942:ViGViWeylHwwbsKO@kontrakan.oacnygb.mongodb.net/kontrakanAAdb?retryWrites=true&w=majority&appName=kontrakan';

const penyewaSchema = new mongoose.Schema({
  nama: String,
  email: String,
  phone: String,
  kontrakan: String,
  status: String,
  joinDate: Date,
  photoUrl: String,
  lastPayment: Date,
});

const Penyewa = mongoose.model('Penyewa', penyewaSchema, 'penyewa');

async function test() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const data = await Penyewa.find({});
    console.log('📦 Data Penyewa:', data);
  } catch (err) {
    console.error('❌ Error connecting or fetching:', err);
  } finally {
    await mongoose.disconnect();
  }
}

test();
