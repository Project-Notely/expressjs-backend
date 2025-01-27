import type { Request, RequestHandler, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { config } from "@/config/environment";

const JWT_SECRET = config.jwt.secret;

export const register: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        if (!password) {
            res.status(400).json({ message: "Password is required" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, password: hashedPassword });
        res.status(201).json({ message: "User created successfully", user: newUser });
        return;
    } catch (error) {
        res.status(500).json({ message: "Error registering user", error: error });
        return;
    }
}

export const login: RequestHandler = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!email) {
            res.status(400).json({ message: "Email is required" });
            return;
        }
        if (!password) {
            res.status(400).json({ message: "Password is required" });
            return;
        }

        const user = await User.findOne({ email });
        if (!user) {
            res.status(404).json({ message: "User not found" });
            return;
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: "Invalid password" });
            return;
        }

        const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ message: "Login successful", token });
        return;
    } catch (error) {
        res.status(500).json({ message: "Error logging in", error: error });
        return;
    }
}

