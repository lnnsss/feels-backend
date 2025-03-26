import { Schema, model } from "mongoose";
import { MessageSchema } from "./Message.mjs"; 

const ChatSchema = new Schema(
  {
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    messages: [MessageSchema], 
  },
  {
    timestamps: true,
  }
);

export default model("Chat", ChatSchema);
