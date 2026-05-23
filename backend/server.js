const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

dotenv.config();

const app = express();

// Allow both common Vite ports for development
const allowedOrigins = ['http://localhost:5173', 'http://localhost:5174'];

app.use(cors({
   origin: allowedOrigins,
   credentials: true
}));

app.use(express.json());

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

// Export io and server BEFORE requiring routes to avoid circular dependency
module.exports = { server, io };

const authRouter = require('./routes/auth/authroutes');
const chatRouter = require('./routes/user/chat');
const messageRouter = require('./routes/user/messages');

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