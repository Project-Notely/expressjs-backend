import express, { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";

// Initialize Firebase Admin
// const firebaseApp = initializeApp({
//   credential: cert({
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
//     privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
//   }),
// });

const app = express();
app.use(express.json());

// Interface for authenticated request
interface AuthRequest extends Request {
  user?: {
    uid: string;
    email: string;
  };
}

// Authentication middleware
const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    const decodedToken = await getAuth().verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
    };
    
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(403).json({ error: 'Invalid or expired token' });
    return;
  }
};

// Route to get user email (protected)
app.get("/user/email", authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.uid;
    
    if (!userId) {
      res.status(401).json({ error: 'User not authenticated' });
      return;
    }

    const userRecord = await getAuth().getUser(userId);
    
    if (!userRecord.email) {
      res.status(404).json({ error: 'Email not found' });
      return;
    }

    res.json({ email: userRecord.email });
  } catch (error) {
    console.error('Error fetching user email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export { app };