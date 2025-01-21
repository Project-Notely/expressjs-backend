import { connectDB } from "../config/mongodb";
import User from "../models/User";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
  try {
    // connect to MongoDB
    await connectDB();

    // test user data
    const testUser = {
      auth0Id: "test-auth0-id-123",
      email: "test@example.com",
      name: "Test User",
      picture: "https://example.com/picture.jpg"
    };

    // create a new user
    const user = new User(testUser);
    await user.save();
    console.log("Test user created successfully:", user);

    // find the user we just created
    const foundUser = await User.findOne({ email: testUser.email });
    console.log("Found user:", foundUser);

    // clean up - delete the test user
    await User.deleteOne({ email: testUser.email });
    console.log("Test user deleted successfully");

    process.exit(0);
  } catch (error) {
    console.error("Test failed:", error);
    process.exit(1);
  }
}

testConnection();