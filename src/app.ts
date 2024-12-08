import "module-alias/register";
import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import authRoutes from "@/routes/authRoutes";

dotenv.config();

const app = express();

// middleware
app.use(cors());
app.use(bodyParser.json());

// routes
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
