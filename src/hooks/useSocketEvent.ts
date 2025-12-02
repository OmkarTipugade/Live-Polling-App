import { useEffect, useRef } from "react";
import { useSocket } from "../context/SocketContext";

/**
 * Custom hook to listen to socket events
 * @param eventName - Name of the socket event to listen to
 * @param callback - Callback function to execute when event is received
 */
export const useSocketEvent = <T = any,>(
    eventName: string,
    callback: (data: T) => void
) => {
    const { socket } = useSocket();
    const callbackRef = useRef(callback);

    // Update callback ref when callback changes
    useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    useEffect(() => {
        if (!socket) return;

        const eventHandler = (data: T) => {
            callbackRef.current(data);
        };

        socket.on(eventName, eventHandler);

        return () => {
            socket.off(eventName, eventHandler);
        };
    }, [socket, eventName]);
};

/**
 * Custom hook to emit socket events
 * @returns Function to emit socket events
 */
export const useSocketEmit = () => {
    const { socket } = useSocket();

    const emit = <T = any,>(eventName: string, data: T) => {
        if (socket && socket.connected) {
            socket.emit(eventName, data);
        } else {
            console.warn(`Cannot emit ${eventName}: Socket not connected`);
        }
    };

    return { emit };
};
