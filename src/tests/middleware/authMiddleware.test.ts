import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "@/config/environment";
import { authenticateToken } from "@/middleware/authMiddleware";

const JWT_SECRET = config.jwt.secret;

describe("Auth Middleware", () => {
    let mockReq: Partial<Request>;
    let mockRes: Partial<Response>;
    let nextFunction: NextFunction;

    beforeEach(() => {
        mockReq = {
            headers: {},
        };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        nextFunction = jest.fn();
    });

    it("should return 401 if no authorization header is provided", () => {
        authenticateToken(mockReq as Request, mockRes as Response, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(401);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Authorization header is required.",
        });
    });

    it("should return 403 for invalid token", () => {
        mockReq.headers = {
            authorization: "Bearer invalid-token",
        };

        authenticateToken(mockReq as Request, mockRes as Response, nextFunction);

        expect(mockRes.status).toHaveBeenCalledWith(403);
        expect(mockRes.json).toHaveBeenCalledWith({
            message: "Invalid or expired token.",
        });
    });

    it("should call next() for valid token", () => {
        const validToken = jwt.sign({ id: "banana" }, config.jwt.secret);
        mockReq.headers = {
            authorization: `Bearer ${validToken}`,
        };

        authenticateToken(mockReq as Request, mockRes as Response, nextFunction);

        expect(nextFunction).toHaveBeenCalled();
        expect((mockReq as any).user).toBeDefined();
    })
});