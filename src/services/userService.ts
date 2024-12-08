import { db } from "@/config/firebaseConfig";
import { UserModel } from "@/models/userModel";

export const saveUserProfile = async (profile: UserModel): Promise<void> => {
  try {
    await db
      .collection("users")
      .doc(profile.uid)
      .set(profile.toJson(), { merge: true });
  } catch (error) {
    console.error("Error saving user profile: ", error);
    throw new Error("Failed to save user profile: " + error);
  }
};

export const getUserProfile = async (
  uid: string
): Promise<UserModel | null> => {
  try {
    const userDoc = await db.collection("users").doc(uid).get();

    if (!userDoc.exists) {
      return null;
    }

    const userData = userDoc.data();
    if (!userData) {
      return null;
    }
    return UserModel.fromJson(userData);
  } catch (error) {
    console.error("Error fetching user profile: ", error);
    throw new Error("Failed to fetch user profile: " + error);
  }
};
