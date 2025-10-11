;import { Server } from "socket.io";

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

export const emitAdminHotelsTable = (hotelId: string, status: string) => {
  if (socketInstance) {
    console.log('Admin Socket Admin ID : ', hotelId);
    const eventData = {
      id: hotelId,
      status: status,
      timeStamp: new Date().toISOString()
    }
    const roomName = `hotel-${hotelId}`
    console.log(`emitting room `, roomName);

    socketInstance.to('admin').emit('admin-hotel-status-changed', eventData)

    const room = socketInstance.sockets.adapter.rooms.get(roomName)
    const clients = room ? Array.from(room) : []
    console.log(`📊 Room ${roomName} has ${clients.length} clients:`, clients);
    return true;
  } else {
    console.error("11111111 Socket instance not available");
    return false;
  }
}

export const emitToHotel = (hotelId: string, status: string) => {
  if (socketInstance) {
    // Make sure the hotelId is correct
    console.log("🏨 Emitting to hotel ID:", hotelId);

    const eventData = {
      id: hotelId,
      status: status,
      timestamp: new Date().toISOString()
    };

    const roomName = `hotel-${hotelId}`;
    console.log("📤 Emitting to room:", roomName);

    // Emit to specific room
    socketInstance.to(roomName).emit("hotel-status-changed", eventData);

    // Debug: check who's in the room
    const room = socketInstance.sockets.adapter.rooms.get(roomName);
    const clients = room ? Array.from(room) : [];
    console.log(`📊 Room ${roomName} has ${clients.length} clients:`, clients);

    return true;
  } else {
    console.error("❌ Socket instance not available");
    return false;
  }

};
export const orderStatusUpdates = (userId: string, message: string) => {
  if (!socketInstance) {
    console.error("❌ Socket instance not available");
    return false;
  }

  const eventData = {
    userId: userId,
    message,
    timestamp: new Date().toISOString(),
  };

  const roomName = `user-${userId}`;
    console.log("📤 Emitting to User room:", roomName);
  
  socketInstance.to(roomName).emit("order-new-notification", eventData);
  
  const room = socketInstance.sockets.adapter.rooms.get(roomName);
  const clients = room ? Array.from(room) : [];
  console.log(`📊 Room ${roomName} has ${clients.length} clients:`, clients);

  return true;
};
