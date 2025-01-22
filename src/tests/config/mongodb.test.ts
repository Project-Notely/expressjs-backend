import mongoose from "mongoose";
import { connectMongoDB } from "@/config/mongodb";
import User from "@/models/User";

describe("MongoDB Connect", () => {
    beforeAll(async () => {
        await connectMongoDB();
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    const testUser = {
        auth0Id: "test-auth0-id",
        email: "test@mongodb.com",
        name: "MongoDB Test User",
        picture: "https://example.com/test.jpg",
    };

    it("should connect to MongoDB successfully", async () => {
        console.log("Connected to database:", mongoose.connection.db?.databaseName);
        expect(mongoose.connection.readyState).toBe(1);
    });

    it("should create and save a user successfully", async () => {
        const user = new User(testUser);
        const savedUser = await user.save();

        expect(savedUser._id).toBeDefined();
        expect(savedUser.auth0Id).toBe(testUser.auth0Id);
        expect(savedUser.email).toBe(testUser.email);
    });

    it("should find a user by email", async () => {
        await new User(testUser).save();
        const foundUser = await User.findOne({ email: testUser.email });

        expect(foundUser).toBeDefined();
        expect(foundUser?.auth0Id).toBe(testUser.auth0Id);
    });

    it("should update a user successfully", async () => {
        const user = await new User(testUser).save();
        const updatedName = 'Updated Test User';

        await User.updateOne({ _id: user._id}, { name: updatedName });
        const updatedUser = await User.findById(user._id);

        expect(updatedUser?.name).toBe(updatedName);
    });

    it("should delete a user successfully", async () => {
        const user = await new User(testUser).save();
        await User.deleteOne({ _id: user._id });

        const deletedUser = await User.findById(user._id);
        expect(deletedUser).toBeNull();
    });
});
