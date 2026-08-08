import { Schema, model, models, Document, Types } from "mongoose";

export interface ISavedRepo extends Document {
  userId: Types.ObjectId;
  owner: string;
  repo: string;
  savedAt: Date;
}

const SavedRepoSchema = new Schema<ISavedRepo>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  owner: { type: String, required: true },
  repo: { type: String, required: true },
  savedAt: { type: Date, default: Date.now },
});

// Ek user ek repo ko dobara save na kar sake, isliye compound unique index
SavedRepoSchema.index({ userId: 1, owner: 1, repo: 1 }, { unique: true });

export const SavedRepo =
  models.SavedRepo || model<ISavedRepo>("SavedRepo", SavedRepoSchema);