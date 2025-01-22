import request from "supertest";
import app from "@/app";
import { mockAuth0TokenEndpoint, mockAuth0UserInfoEndpoint } from "../mocks/auth0";

jest.mock("axios");

describe("Auth Routes", () => {
  describe("GET /callback", () => {
    it("should handle Auth0 callback successfully", async () => {
      mockAuth0TokenEndpoint();
      mockAuth0UserInfoEndpoint();

      const response = await request(app)
        .get("/auth/callback")
        .query({ code: "test-code" });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("User authenticated successfully");
      expect(response.body.user).toBeDefined();
    });

    it("should return 400 if code is missing", async () => {
      const response = await request(app)
        .get("/auth/callback");

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Authorization code is missing");
    });
  });
});