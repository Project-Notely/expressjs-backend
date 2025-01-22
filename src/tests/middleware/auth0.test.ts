import { checkJwt } from "@/config/auth0";
import type { Request, Response, NextFunction } from "express";

describe("Auth0 Middleware", () => {
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

  it("should reject requests without authorization header", async () => {
    await checkJwt(mockReq as Request, mockRes as Response, nextFunction);
    expect(nextFunction).toHaveBeenCalledWith(expect.any(Error));
  });
});