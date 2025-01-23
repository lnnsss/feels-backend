import { Schema, model } from "mongoose";

const PostSchema = Schema(
  {
    userID: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: false,
      default: "#ffffff",
    },
  },
  {
    timestamps: true,
  }
);

export default model("Post", PostSchema);
