import { Schema, model } from "mongoose";

const UserSchema = Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  avatarURL: {
    type: String,
    required: false,
    default: "",
  },
  status: {
    type: String,
    required: false,
    default: "",
  },
  subscriptions: {
    type: [Schema.Types.ObjectId],
    ref: "User",
    required: true,
    default: [],
  },
  roles: {
    type: [String],
    required: true,
    default: ["USER"]
  }
}, {
  timestamps: true
});

export default model("User", UserSchema);
