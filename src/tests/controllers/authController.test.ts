import { register, login } from "@/controllers/authController";
import User from "@/models/User";
import type { Request, Response } from "express";
import { config } from "@/config/environment";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = config.jwt.secret;