import express from "express";
import type { Application } from "express";
import dotenv from "dotenv";
// import { connectDB } from "./config/mongodb";
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
app.get("/api/protected", checkJwt, (req, res) => {
    res.json({ message: "This is a protected route!" });
});

// global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err.name === "UnauthorizedError") {
      return res.status(401).json({ message: "Invalid or missing token" });
    }
    res.status(500).json({ message: err.message });
  });

export default app;