import "dotenv/config";
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
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
// Setup socket.io auth
io.use((socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        return next(new Error('Unauthorized: No token provided'));
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        socket.user = decoded; // You can use this in connection logs
        next();
    } catch (err) {
        return next(new Error('Invalid token'));
    }
});

io.on('connection', (socket) => {
    console.log('✅ Connected:', socket.user?.id);

    socket.on('disconnect', () => {
        console.log('❌ Disconnected:', socket.user?.id);
    });
});


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});