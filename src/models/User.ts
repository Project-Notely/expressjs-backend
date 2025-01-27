import { Schema, Document, model } from "mongoose";

// user document interface
export interface Auth0User extends Document {
    auth0Id: string;
    email: string;
    name: string;
    picture: string;
}

// user schema
const Auth0UserSchema: Schema = new Schema({
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String, required: true }
},
    { timestamps: true }
);

export interface User extends Document {
    email: string;
    password: string;
}

const UserSchema: Schema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
},
    { timestamps: true }
);

export default model<User>("User", UserSchema);