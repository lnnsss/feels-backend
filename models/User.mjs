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
    required: false,
  },
  lastName: {
    type: String,
    required: false,
  },
  avatarURL: {
    type: String,
    required: false,
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
}, {
  timestamps: true
});

export default model("User", UserSchema);