import { Router } from "express";
import { authenticateToken } from "@/middleware/authMiddleware";

const router = Router();

router.get("/protected", authenticateToken, (req, res) => {
    const user = (req as any).user;  // decode token payload
    res.status(200).json({
        message: "This is a protected route",
        user,
    });
});

export default router;