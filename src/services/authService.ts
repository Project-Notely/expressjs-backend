import admin from "firebase-admin";
import { UserRecord } from "firebase-admin/lib/auth";

// create new user with email/password
export const createEmailPasswordUser = async (
  email: string,
  password: string
): Promise<UserRecord> => {
  try {
    const user = await admin.auth().createUser({ email, password });
    return user;
  } catch (error) {
    throw new Error("Failed to create Firebase user: " + error);
  }
};

// verify Google ID token and retrieve user info
