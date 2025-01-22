import express from "express";
import type { Application, Request, Response } from "express";
import dotenv from "dotenv";
import { connectMongoDB } from "@/config/mongodb";
import redis from "@/config/redis";
import { checkJwt } from "@/config/auth0";
import authRoutes from "@/routes/authRoutes";
import User from "@/models/User";

interface AuthRequest extends Request {
    auth?: {
        sub: string;
        [key: string]: any;
    };
}

dotenv.config();

const app: Application = express();

// middleware
app.use(express.json());

// connect to MongoDB
connectMongoDB();


// routes
app.use("/api/auth", authRoutes);

// protected routes
app.get("/api/profile", checkJwt, async (req: AuthRequest, res: Response) => {
    const auth0Id = req.auth?.sub;

    try {
        const user = await User.findOne({ auth0Id });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Profile retrieved successfully", user });
    } catch (error) {
        console.error("Error retrieving profile", error);
        res.status(500).json({ message: "Error retrieving profile", error: error instanceof Error ? error.message : "Unknown error" });
    }
});

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