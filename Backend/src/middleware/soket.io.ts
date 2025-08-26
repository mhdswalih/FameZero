import { Server } from "socket.io";

declare module "express-serve-static-core" {
  interface Request {
    io?: Server;
  }
}


let socketInstance: Server | null = null;

export const setSocketInstance = (io: Server) => {
  socketInstance = io;
  console.log("✅ Socket instance set globally");
};

export const getSocketInstance = (): Server | null => {  
  return socketInstance;
};

export const emitToHotel = (hotelId: string, status: string) => {
  if (socketInstance) {
    const eventData = {
      id: hotelId,
      status: status,
      timestamp: new Date().toISOString()
    };
    
  
    const roomName = `hotel-${hotelId}`;
    
    // Emit to specific room
    socketInstance.to(roomName).emit("hotel-status-changed", eventData);
    
    // Broadcast to all clients
    socketInstance.emit("hotel-status-changed", eventData);
    
    console.log(`📡 Emitted hotel-status-changed:`, eventData);
    
    const room = socketInstance.sockets.adapter.rooms.get(roomName);
    console.log(`📊 Room ${roomName} has ${room ? room.size : 0} clients`);
    
    return true;
  } else {
    console.error("❌ Socket instance not available");
    return false;
  }
};