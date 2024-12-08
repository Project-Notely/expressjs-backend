import { Request, Response } from "express";
import { saveUserProfile, getUserProfile } from "@/services/userService";
import { UserModel } from "@/models/userModel";

export const verifyUserController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // retrieve user from middleware
    const user: UserModel = (req as any).user;

    // get existing user profile from firestore
    const existingUserProfile = await getUserProfile(user.uid);

    // create new user profile with existing and new user data
    const userProfile = new UserModel({
      ...existingUserProfile?.toJson(),
      ...user.toJson(),
    });

    // save or update user profile in firestore
    await saveUserProfile(userProfile);

    res.status(200).json({ message: "User profile verified and saved" });
  } catch (error: unknown) {
    console.log("Error verifying user profile: ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Failed to verify user profile", error: errorMessage });
  }
};

export const getUserProfileController = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  try {
    // get user profile from firestore
    const userProfile = await getUserProfile(user.uid);
    if (!userProfile) {
      res.status(404).json({ error: "User profile not found" });
      return;
    }
    res.status(200).json(userProfile.toJson());
  } catch (error) {
    console.log("Error getting user profile: ", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    res
      .status(500)
      .json({ message: "Failed to get user profile", error: errorMessage });
  }
};
