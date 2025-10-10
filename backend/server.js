import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

if (process.env.MONGO_URI) {
	connectDB(process.env.MONGO_URI).catch(err => console.error(err));
}

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

