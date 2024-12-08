import { Router } from "express";
import { verifyUserController, getUserProfileController } from "@/controllers/authController";
import { verifyToken } from "@/middlewares/authMiddleware";

const router = Router();

// verify user and save profile
router.post("/verify", verifyToken,verifyUserController);

// get user profile
router.get("/profile", verifyToken, getUserProfileController);

export default router;
