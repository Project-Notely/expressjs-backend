import express from "express";
import type { Application } from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/mongodb";
import redis from "./config/redis";
import { checkJwt } from "./config/auth0";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app: Application = express();

// middleware
app.use(express.json());

// routes
app.use("/api/auth", authRoutes);

// protected routes
app.use(checkJwt);

app.get("/api/protected", (req, res) => {
    res.json({ message: "This is a protected route!" });
});

// global error handler
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: err.message });
});

export default app;