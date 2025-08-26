import  express from 'express';
import http from 'http'
import { Server } from 'socket.io'
import cookieParser from 'cookie-parser';
import userRouter from './routers/userRouters/userRoute'
import hotelRoutes from './routers/hoteRoutes/hotelRoutes'
import cors from 'cors';
import './config/redisService';
import dotenv from 'dotenv'
import { connectDB } from './config/db';
import { errorHandler } from './middleware/erorrMiddleware';
import adminRoutes from './routers/adminRouters/adminRouters';
import profileRouter from './routers/userRouters/ProfileRoutes/profileRoutes';
import hotelProfileRoutes from './routers/hoteRoutes/hotelProfileRoutes';
dotenv.config()

import type { Request, Response, NextFunction } from 'express';
import { setSocketInstance } from './middleware/soket.io';

declare global {
  namespace Express {
    interface Request {
      io?: Server;
    }
  }
}

const app = express()

const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, 
    methods: ["GET", "POST"],
    credentials: true
  }
});

io.on("connection", (socket) => {
  console.log("⚡️ New client connected", socket.id);

  // Join hotel-specific room
  socket.on("join-hotel-room", (userId) => {
    const roomName = `hotel-${userId}`;
    socket.join(roomName);
    console.log(`✅ User ${userId} joined room ${roomName} with socket ${socket.id}`);
    
    // Confirm room joining
    socket.emit("room-joined", { room: roomName, userId });
  });

  // Handle leaving room
  socket.on("leave-hotel-room", (userId) => {
    const roomName = `hotel-${userId}`;
    socket.leave(roomName);
    console.log(`❌ User ${userId} left room ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

setSocketInstance(io);

app.use(cors({
    origin:process.env.CLIENT_URL,
    methods:['GET','POST','PUT','DELETE'],
    allowedHeaders:['Content-Type','Authorization'],
    credentials : true

}))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(express.static('public'))
app.use(cookieParser());



app.use('/api',userRouter)
app.use('/api',profileRouter)
app.use('/api/hotel',hotelRoutes)
app.use('/api/hotel',hotelProfileRoutes)
app.use('/api/admin',adminRoutes)
app.use(errorHandler)


connectDB().then(() => {
  server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
