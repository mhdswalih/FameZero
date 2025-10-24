// Utils/socket-service.ts
import io, { Socket } from 'socket.io-client';

interface SocketOptions {
  role: 'admin' | 'hotel' | 'user';
  token: string | null;
  id: string;
}

class SocketService {
  private socket: Socket | null = null;
  private static instance: SocketService;
  private currentRole: string | null = null;
  private token: string | null = null;
  private id: string | null = null;

  private constructor() { }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  public connect(options: SocketOptions): void {
    if (this.socket?.connected) {
      console.log("✅ Socket already connected");
      return;
    }

    this.currentRole = options.role;
    this.token = options.token;
    this.id = options.id;

    if (options.role === 'user' && !options.id) {
      console.error("❌ User ID is required for user role");
      return;
    }

    if(this.token === null){
      console.log("token null");
    }

    if (options.role === 'hotel' && !options.id) {
      console.error("❌ Hotel ID is required for hotel role");
      return;
    }

    console.log(`🔌 Connecting socket with role: ${options.role}, ID: ${options.id}`);

    this.socket = io("http://localhost:3000", {
      transports: ["websocket"],
      forceNew: false,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000,
      auth: {
        role: options.role,
        token: options.token,
        id: options.id
      }
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      console.log("✅ Socket connected:", this.socket?.id);
      this.autoJoinRoom();
    });

    this.socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    this.socket.on("connect_error", (error) => {
      console.error("🔥 Socket connection error:", error.message);
    });

    this.socket.on("reconnect", (attemptNumber) => {
      console.log("🔄 Socket reconnected after", attemptNumber, "attempts");
      this.autoJoinRoom();
    });

    this.socket.on("room-joined", (data) => {
      console.log("✅ Successfully joined room:", data.room);
    });

    this.socket.on("auth-error", (error) => {
      console.error("🔐 Authentication error:", error);
    });
  }

  private autoJoinRoom(): void {
    if (!this.socket?.connected || !this.currentRole || !this.id) return;

    switch (this.currentRole) {
      case 'user':
        this.joinUserRoom(this.id);
        break;
      case 'hotel':
        this.joinHotelRoom(this.id);
        break;
      case 'admin':
        this.socket.emit('join-admin-room');
        break;
    }
  }

  public joinHotelRoom(hotelId: string): void {
    if (!this.socket?.connected) {
      console.error("❌ Socket not connected. Cannot join room.");
      return;
    }

    console.log(`🏨 Requesting to join hotel room: hotel-${hotelId}`);
    this.socket.emit('join-hotel-room', hotelId);

    this.socket.once('room-joined', (data) => {
      console.log("✅ Successfully joined room:", data.room);
    });
  }

  public joinUserRoom(userId: string): void {
    if (!this.socket?.connected) {
      console.error("❌ Socket not connected. Cannot join room.");
      return;
    }

    console.log('👤 Requesting to join user room for user:', userId);
    this.socket.emit('join-user-room', userId);

    this.socket.once('room-joined', (data: any) => {
      console.log('✅ User successfully joined room:', data.room);
      if (data.userId) {
        console.log('✅ User ID confirmed:', data.userId);
      }
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