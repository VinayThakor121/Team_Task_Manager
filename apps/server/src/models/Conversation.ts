import { Schema, model, type InferSchemaType } from "mongoose";

const conversationSchema = new Schema(
  {
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      default: "",
      trim: true,
    },
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

export type IConversation = InferSchemaType<typeof conversationSchema>;
export const Conversation = model<IConversation>("Conversation", conversationSchema);
