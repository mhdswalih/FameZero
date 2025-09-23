import io, { Socket } from 'socket.io-client';
interface SocketOptions {
  role: 'admin' | 'hotel' | 'user';
  token: string | null
}


class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  private currentRole: string | null = null;
  private token: string | null = null;

  private constructor() { }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(options: SocketOptions): void {
    if (this.socket?.connected) {
      console.log("Socket already connected");
      return;
    }
    this.currentRole = options.role;
    this.token = options.token;

  this.socket = io("http://localhost:3000", {
      transports: ["websocket"],
      forceNew: false,
      reconnection: true,
      timeout: 5000,
      auth: {
        role: options.role,
        token: options.token
      }
    });
    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
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

    this.socket.on("room-joined", (data) => {
      console.log("✅ Successfully joined room:", data.room);
    });
  }

  // In your SocketService
  // In your SocketService
  public joinHotelRoom(hotelId: string): void {
    if (!this.socket?.connected) {
      console.error("❌ Socket not connected. Cannot join room.");
      return;
    }

    this.socket.emit('join-hotel-room', hotelId);
    console.log(`🏨 Requesting to join hotel room: hotel-${hotelId}`);

    // Listen for confirmation with correct parameter name
    this.socket.once('room-joined', (data) => {
      console.log("✅ Successfully joined room:", data.room);
      console.log("✅ Hotel ID confirmed:", data.hotelId);
    });
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

  public once(event: string, callback: (...args: any[]) => void): void {
    if (this.socket) {
      this.socket.once(event, callback);
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