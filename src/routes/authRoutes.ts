import { Router } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const router: Router = Router();

router.post("/login", (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ message: "Username is required" });
    }

    const token = jwt.sign({ sub: username }, process.env.AUTH0_CLIENT_SECRET || "", {
        audience: process.env.AUTH0_AUDIENCE,
        issuer: `https://${process.env.AUTH0_DOMAIN}/`,
        expiresIn: "1h",
    });

    res.json({ token });
});

router.get("/profile", (req, res) => {
    res.json({ message: "This is a protected profile route" });
});

export default router;
