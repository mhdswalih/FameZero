import express, { Request, Response, NextFunction } from 'express';
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
import { setSocketInstance } from './middleware/soket.io';
import { getJWTInfoFromToken } from './utils/jwt';
import productRoutes from './routers/userRouters/productRoutes';
import { handleError } from './utils/httperr';

declare global {
  namespace Express {
    interface Request {
      io?: Server;
    }
  }
}

const app = express()

const server = http.createServer(app)

export const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  }
});


io.use((socket, next) => {
  const { role, token } = socket.handshake.auth;

  const { id } = getJWTInfoFromToken(token)

  if (role === 'hotel' && !token) {
    return next(new Error('Hotel ID required for hotel role'));
  }
  if (role === 'user') {
    return next(new Error('User ID required for user role'));
  }
  socket.data.role = role;
  socket.data.id = id;
  next();
});


// Fixed server-side socket logic

io.on("connection", (socket) => {
  console.log("⚡️ New client connected", socket.id);

  // Auto-join based on role
  if (socket.data.role === 'admin') {
    socket.join('admin');
    console.log(`✅ Admin joined admin room with socket ${socket.id}`);
  } else if (socket.data.role === 'hotel') {
    const roomName = `hotel-${socket.data.id}`;
    socket.join(roomName);
    console.log(`✅ Hotel ${socket.data.id} auto-joined room ${roomName}`);
  } else if (socket.data.role === 'user') {
    const roomName = `user-${socket.data.id}`;
    socket.join(roomName);
    console.log(`✅ User ${socket.data.id} auto-joined room ${roomName}`);
  }
  
  socket.on("join-hotel-room", (hotelId) => {
    if (!hotelId) {
      console.log('❌ No hotelId provided for room joining');
      return;
    }

    const roomName = `hotel-${hotelId}`;
    socket.join(roomName);
    console.log(`✅ Hotel ${hotelId} joined room ${roomName} with socket ${socket.id}`);

    socket.emit("room-joined", {
      room: roomName,
      hotelId: hotelId,
      success: true
    });

    const room = io.sockets.adapter.rooms.get(roomName);
    console.log(`📊 Room ${roomName} now has ${room ? room.size : 0} clients`);
  });

  socket.on("leave-hotel-room", (hotelId) => {
    const roomName = `hotel-${hotelId}`;
    socket.leave(roomName);
    console.log(`❌ Hotel ${hotelId} left room ${roomName}`);
  });

  // User room join handler - MOVED OUTSIDE, not nested
  socket.on('join-user-room', (userId) => {
    if (!userId) {
      console.log('❌ userId missing');
      return;
    }

    const roomName = `user-${socket.data.id}`;
    socket.join(roomName);

    console.log(`✅ User ${socket.data.id} joined room ${roomName} with socket ${socket.id}`);

    socket.emit('room-joined', {
      room: roomName,
      userId,
      success: true
    });

    const room = io.sockets.adapter.rooms.get(roomName);
    console.log(`📊 Room ${roomName} now has ${room ? room.size : 0} clients`);
  });

  socket.on("leave-user-room", (userId) => {
    const roomName = `user-${socket.data.id}`;
    socket.leave(roomName);
    console.log(`❌ User ${socket.data.id} left room ${roomName}`);
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected", socket.id);
  });
});

setSocketInstance(io);
app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser());



app.use('/api', userRouter)
app.use('/api', profileRouter)
app.use('/api', productRoutes)
app.use('/api/hotel', hotelRoutes)
app.use('/api/hotel', hotelProfileRoutes)
app.use('/api/admin', adminRoutes)
app.use(errorHandler)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  handleError(res, err);
});



connectDB().then(() => {
  server.listen(3000, () => {
    console.log(`Server is running on port 3000`);
  });
}).catch(err => {
  console.error('Failed to connect to MongoDB:', err);
});
