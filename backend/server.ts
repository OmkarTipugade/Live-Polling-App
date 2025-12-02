import express, { type Request, type Response } from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { setupSocketHandlers } from "./socket/socketHandler.js";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const PORT = process.env.PORT;

const corsOptions = {
    origin: process.env.FRONTEND_URL as string,
    credentials: true,
}

// Initialize Socket.io with CORS
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL as string,
        credentials: true,
        methods: ["GET", "POST"]
    }
});

const start = () => {
    app.use(express.json());
    app.use(cors(corsOptions));

    app.get("/", (req: Request, res: Response) => {
        res.send("Express + TypeScript server running with Socket.io!");
    });

    // Setup Socket.io event handlers
    setupSocketHandlers(io);

    // Connect to MongoDB and start server
    httpServer.listen(PORT, () => {
        mongoose.connect(process.env.MONGODB_URI as string)
        .then(() => {
            console.log("Connected to MongoDB");
            console.log(`Server running at ${PORT}`);
            console.log("Socket.io is ready for real-time connections");
        })
        .catch((error) => {
            console.log(error);
        })
    });
}

start();

export { io };
