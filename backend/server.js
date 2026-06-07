import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import authRouter from './routes/auth/authroutes.js';
import chatRouter from './routes/user/chat.js';
import messageRouter from './routes/user/messages.js';

dotenv.config();

const app = express();

// Allow both common Vite ports for development
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
   origin: allowedOrigins,
   credentials: true
}));

app.use(express.json({ limit: "50mb" }));

const server = http.createServer(app);

const io = new Server(server, {
   cors: {
      origin: allowedOrigins,
      credentials: true
   }
});

app.get('/', (req, res) => {
   res.json({ message: 'Hello from the backend!' });
});

app.use('/api', authRouter);
app.use('/api/chat', chatRouter);
app.use('/api/message', messageRouter);

export const userSocketMap = {}
io.on("connection", (socket) => {

    const userId = socket.handshake.query.userId 
    if (!userId) return;
    if (!userSocketMap[userId]) {
   userSocketMap[userId] = new Set();
    }
    userSocketMap[userId].add(socket.id);
    
    io.emit("getOnlineUsers",Object.keys(userSocketMap))
    // Object.keys() always returns strings 

   socket.on("joinChat", (chatId) => {
      socket.join(`chat:${chatId}`);
   });

   socket.on("disconnect", () => {
      console.log("user disconnected");
      userSocketMap[userId].delete(socket.id);

   if (userSocketMap[userId].size === 0) {
      delete userSocketMap[userId];
   }
   io.emit("getOnlineUsers",Object.keys(userSocketMap))

   });
});

const port = process.env.PORT || 5000;

server.listen(port, () => {
   console.log(`Server running on port ${port}`);
});

export { server, io };

//// userSocketMap looks like this:
// {
//   "1":  Set { "socketId_abc", "socketId_xyz" },  // user 1 logged in from 2 devices
//   "10": Set { "socketId_def" }                    // user 10 logged in from 1 device
// }
// We only want to emit the user IDs (keys) to the frontend, not the socket IDs (values). Because the frontend only needs to know which users are online, not which socket they're using.
// jsObject.keys(userSocketMap) // → ["1", "10"]  ✅ just the user IDs 1 and 10 are two different users who are online, regardless of how many devices/sockets they have.
// The reason it's an object with Sets as values (instead of a simple array of userIds) is to handle multiple devices/tabs:
// js// User 10 opens app in 2 tabs:
// userSocketMap = {
//   "10": Set { "socketId_tab1", "socketId_tab2" }
// }

// // If tab1 closes, user is still online because Set still has socketId_tab2
// // Only remove from onlineUsers when Set is empty (all tabs closed)