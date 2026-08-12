import { Document, Model, model, models, Schema } from "mongoose";

export interface IUser extends Document{
    name : string;
    email : string;
    password : string | null;
    provider : "credentials" | "github";
    githubId? : string | null;
    image?: string | null;
    createdAt: Date
}

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  provider: { type: String, enum: ["credentials", "github"], required: true },
  githubId: { type: String, default: null },
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const User = (models.User as Model<IUser>) || model<IUser>("User", UserSchema)