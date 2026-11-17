import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ["educator", "student"],
      default: "student",
    },
    bio: {
      type: String,
      required: false,
      trim: true,
    },
    googleId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.index(
  { googleId: 1 },
  {
    unique: true,
    partialFilterExpression: {
      googleId: { $type: "string" },
    },
  },
);

const User = mongoose.model("User", userSchema);

export default User;
