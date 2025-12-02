import { io, Socket } from "socket.io-client";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

class SocketService {
    private socket: Socket | null = null;

    connect(): Socket {
        if (!this.socket) {
            this.socket = io(BACKEND_URL, {
                withCredentials: true,
                autoConnect: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5
            });

            this.socket.on("connect", () => {
                console.log("Connected to Socket.io server:", this.socket?.id);
            });

            this.socket.on("disconnect", () => {
                console.log("Disconnected from Socket.io server");
            });

            this.socket.on("connect_error", (error) => {
                console.error("Connection error:", error);
            });
        }

        return this.socket;
    }

    getSocket(): Socket | null {
        return this.socket;
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            console.log("Socket disconnected manually");
        }
    }

    isConnected(): boolean {
        return this.socket?.connected || false;
    }
}

export const socketService = new SocketService();
