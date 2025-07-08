import "dotenv/config";
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import authMiddleware from './middleware/auth.js';
import onlineStatus from './middleware/onlineStatus.js';

import connectDB from "./config/db.js";

import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import actionRoutes from './routes/actionRoutes.js';

const app = express();
const server = http.createServer(app);

// Socket.io configuration
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_URL,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
    }
});

// Make io globally accessible
global.io = io;

// Middleware
app.use(cors({
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));

app.use(helmet());
app.use(express.json());

// Database Connection
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', authMiddleware, onlineStatus, taskRoutes);
app.use('/api/actions', authMiddleware, onlineStatus, actionRoutes);

// WebSocket connection
io.on('connection', (socket) => {
    console.log('WebSocket client connected');

    socket.on('disconnect', () => {
        console.log('WebSocket client disconnected');
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});