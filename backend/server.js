import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIO } from './socket.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

// Ensure we attempt to connect to a MongoDB instance. If MONGO_URI is not set
// fall back to the local development database used elsewhere in scripts.
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/deone';
connectDB(MONGO_URI).catch(err => console.error(err));

const httpServer = createServer(app);
// reuse same env parsing: allow comma-separated FRONTEND_ORIGINS or single FRONTEND_ORIGIN
const rawOrigins = process.env.FRONTEND_ORIGINS || process.env.FRONTEND_ORIGIN || '*';
let socketOrigins = rawOrigins;
if (rawOrigins !== '*') {
  socketOrigins = rawOrigins.split(',').map(s => s.trim()).filter(Boolean);
  if (socketOrigins.length === 1) socketOrigins = socketOrigins[0];
}
const io = new Server(httpServer, {
  cors: { origin: socketOrigins, credentials: true }
});

// expose io to the rest of the app
setIO(io);

io.on('connection', socket => {
	console.log('Socket conectado:', socket.id);
	// merchants can join a room with their merchant id
	socket.on('joinMerchant', merchantId => {
		if (merchantId) {
			socket.join(String(merchantId));
		}
	});
});

httpServer.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

