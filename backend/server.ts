import express, { type Request, type Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const PORT = process.env.PORT;

const start = () => {
    app.use(express.json());

    app.get("/", (req: Request, res: Response) => {
        res.send("Express + TypeScript server running!");
    });


app.listen(PORT, () => {
    mongoose.connect(process.env.MONGODB_URI as string)
    .then(() => {
        console.log("Connected to MongoDB");
        console.log(`Server running at ${PORT}`);
    })
    .catch((error) => {
        console.log(error);
    })
});
}

start();
