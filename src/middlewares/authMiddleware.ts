import { Request, Response, NextFunction } from "express";
import { admin } from "@/config/firebaseConfig";

export const verifyToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ message: "Unauthorized. Missing or invalid token." });
    return;
  }

  const token = authorization.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken; // attach user info to the request
    next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized. Invalid token." });
  }
};
