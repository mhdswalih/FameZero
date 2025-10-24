import { createContext, useContext, useEffect, ReactNode } from "react";
import { toast } from "react-hot-toast";
import SocketService from "../utils/socket-service";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";

interface INotification {
  message: string;
  timeStamp: string;
}

interface NotificationProviderProps {
  children: ReactNode;
}

const NotificationContext = createContext<null>(null);

export const NotificationProvider = ({ children }: NotificationProviderProps) => {
  const userId = useSelector((state: RootState) => state.user.id);

   const token = useSelector((state: RootState) => state.user.token)
 // In NotificationProvider
useEffect(() => {
  if (!userId || !token) {
    console.log("❌ No userId or token, skipping socket connection...");
    return;
  }

  const socket = SocketService.getInstance();

  if (!socket.isConnected()) {
    console.log("🔌 Connecting socket...");
    socket.connect({
      role: 'user',
      token,
      id: userId,  // ensure this is defined (string, not undefined/null)
    });
  }

  const joinTimer = setTimeout(() => {
    if (socket.isConnected()) {
      socket.joinUserRoom(userId);
    } else {
      console.error("❌ Socket not connected after timeout!");
    }
  }, 1000);

  socket.on("order-new-notification", (data: INotification) => {
    toast.success("👌 " + data.message);
  });

  return () => {
    clearTimeout(joinTimer);
    socket.off("order-new-notification");
    socket.emit("leave-user-room", userId);
  };
}, [userId, token]);


  return (
    <NotificationContext.Provider value={null}>
      {children}
    </NotificationContext.Provider>
  );
};

// Optional helper hook (in case later you want context data)
export const useNotification = () => useContext(NotificationContext);
