import User from "@/models/User";
import mongoose from "mongoose";

describe("User Model Test", () => {
  const validUserData = {
    auth0Id: "auth0|123456",
    email: "test@example.com",
    name: "Test User",
    picture: "https://example.com/picture.jpg"
  };

  it("should create & save user successfully", async () => {
    const user = new User(validUserData);
    const savedUser = await user.save();
    
    expect(savedUser._id).toBeDefined();
    expect(savedUser.auth0Id).toBe(validUserData.auth0Id);
    expect(savedUser.email).toBe(validUserData.email);
    expect(savedUser.name).toBe(validUserData.name);
    expect(savedUser.picture).toBe(validUserData.picture);
  });

  it("should fail to save user without required fields", async () => {
    const userWithoutRequiredField = new User({ name: "Test User" });
    let err;
    try {
      await userWithoutRequiredField.save();
    } catch (error) {
      err = error;
    }
    expect(err).toBeInstanceOf(mongoose.Error.ValidationError);
  });
});