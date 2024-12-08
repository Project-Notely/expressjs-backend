import { Timestamp } from "firebase-admin/firestore";

export class UserModel {
  uid: string;
  name: string;
  email: string;
  photoURL?: string | null;
  phoneNumber?: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLogin: Timestamp;

  constructor({
    uid,
    name,
    email,
    photoURL = null,
    phoneNumber = null,
    createdAt,
    updatedAt,
    lastLogin,
  }: {
    uid: string;
    name: string;
    email: string;
    photoURL?: string | null;
    phoneNumber?: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastLogin: Timestamp;
  }) {
    this.uid = uid;
    this.name = name;
    this.email = email;
    this.photoURL = photoURL;
    this.phoneNumber = phoneNumber;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.lastLogin = lastLogin;
  }

  static fromJson(json: any): UserModel {
    if (!json.uid || !json.name || !json.email) {
      throw new Error("Invalid user data");
    }

    return new UserModel({
      uid: json.uid,
      name: json.name,
      email: json.email,
      photoURL: json.photoURL,
      phoneNumber: json.phoneNumber,
      createdAt: json.createdAt,
      updatedAt: json.updatedAt,
      lastLogin: json.lastLogin,
    });
  }

  toJson(): any {
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
      photoURL: this.photoURL,
      phoneNumber: this.phoneNumber,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      lastLogin: this.lastLogin,
    };
  }
}
