import { Schema, model } from "mongoose";

const conversationSchema = new Schema(
  {
    isGroupChat: { type: Boolean, default: false },
    groupName: { type: String, default: "", trim: true },
    members: [{ type: Schema.Types.ObjectId, ref: "User" }],
    admin: { type: Schema.Types.ObjectId, ref: "User", default: null },
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message", default: null },
  },
  { timestamps: true },
);

export const Conversation = model("Conversation", conversationSchema);
