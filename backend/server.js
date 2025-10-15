import dotenv from 'dotenv';
import app from './app.js';
import { connectDB } from './config/db.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { setIO } from './socket.js';

dotenv.config();

const PORT = process.env.PORT || 4000;

if (process.env.MONGO_URI) {
	connectDB(process.env.MONGO_URI).catch(err => console.error(err));
}

const httpServer = createServer(app);
const io = new Server(httpServer, {
	cors: {
		origin: '*'
	}
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

