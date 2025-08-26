import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;

  private constructor() {} 

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }
  

  public connect(userId: string): void {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }
    this.socket = io("http://localhost:3000", {
      transports: ["websocket"],
      forceNew: false,
      reconnection: true,
      timeout: 5000,
    });

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.socket?.emit("join-hotel-room", userId);
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔥 Socket connection error:", error);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
    });
  }

   public joinHotelRoom(hotelId: string) {
    if (this.socket) {
      this.socket.emit('join-hotel-room', hotelId);
      console.log(`🏨 Requesting to join hotel room: ${hotelId}`);
    }
  }

  public disconnect(): void {
    if (this.socket) {
      console.log("🧹 Disconnecting socket");
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public on(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.on(event, callback);
    } else {
      console.warn("Socket not connected. Cannot listen to event:", event);
    }
  }

  public off(event: string, callback?: (...args: any[]) => void): void {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);
      } else {
        this.socket.off(event);
      }
    }
  }

  public emit(event: string, data: any): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else {
      console.warn("Socket not connected. Cannot emit event:", event);
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public getSocketId(): string | undefined {
    return this.socket?.id;
  }
}

export default SocketService;