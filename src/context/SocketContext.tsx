import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { type Socket } from "socket.io-client";
import { socketService } from "../utils/socketService";

interface SocketContextType {
    socket: Socket | null;
    isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    isConnected: false
});

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error("useSocket must be used within SocketProvider");
    }
    return context;
};

interface SocketProviderProps {
    children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        // Initialize socket connection
        const socketInstance = socketService.connect();
        setSocket(socketInstance);

        // Listen for connection status changes
        const handleConnect = () => setIsConnected(true);
        const handleDisconnect = () => setIsConnected(false);

        socketInstance.on("connect", handleConnect);
        socketInstance.on("disconnect", handleDisconnect);

        // Set initial connection status
        setIsConnected(socketInstance.connected);

        // Cleanup on unmount
        return () => {
            socketInstance.off("connect", handleConnect);
            socketInstance.off("disconnect", handleDisconnect);
            // Don't disconnect socket on unmount to maintain connection
            // socketService.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </SocketContext.Provider>
    );
};
