import mongoose, { Schema, Document } from "mongoose";

// user document interface
export interface IUser extends Document {
    auth0Id: string;
    email: string;
    name: string;
    picture: string;
}

// user schema
const UserSchema: Schema = new Schema({
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String, required: true }
},
    { timestamps: true }
);

export default mongoose.model<IUser>("User", UserSchema);