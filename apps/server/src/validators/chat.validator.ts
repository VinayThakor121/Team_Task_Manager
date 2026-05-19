import { z } from "zod";

export const createDirectChatSchema = z.object({
  body: z.object({
    participantId: z.string().min(1),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const createGroupChatSchema = z.object({
  body: z.object({
    groupName: z.string().min(3),
    memberIds: z.array(z.string()).min(1),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export const updateGroupNameSchema = z.object({
  body: z.object({
    groupName: z.string().min(3),
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const updateGroupMembersSchema = z.object({
  body: z.object({
    memberIds: z.array(z.string()).min(1),
  }),
  query: z.object({}).optional(),
  params: z.object({
    id: z.string().min(1),
  }),
});

export const createMessageSchema = z.object({
  body: z.object({
    conversationId: z.string().min(1),
    content: z.string().min(1),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});
