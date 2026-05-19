import OpenAI from "openai";
import { z } from "zod";
import { env } from "../config/env.js";

const responseSchema = z.object({
  subtasks: z.array(z.string().min(3)).min(3).max(8),
});

const buildPrompt = (title, description) => `You are a project manager assistant. Break the task into 4-6 concise implementation subtasks.
Return strict JSON with the shape {"subtasks": string[]}.
Task title: ${title}
Task description: ${description ?? "N/A"}`;

const fallbackSubtasks = (title) => {
  const normalized = title.toLowerCase();
  const base = [
    "Define acceptance criteria and edge cases",
    "Implement the required backend endpoints",
    "Build the frontend flow and reusable UI",
    "Add validation, authorization, and error handling",
    "Test the full user journey and deployment readiness",
  ];
  if (normalized.includes("auth")) {
    return [
      "Create signup API",
      "Create login API",
      "Setup JWT middleware",
      "Add role-based authorization",
      "Create protected routes",
    ];
  }
  if (normalized.includes("chat")) {
    return [
      "Define conversation and message schemas",
      "Create chat and message APIs",
      "Wire Socket.IO real-time events",
      "Build the chat sidebar and conversation view",
      "Handle unread counts and presence states",
    ];
  }
  return base;
};

export const aiService = {
  async generateSubtasks(title, description) {
    if (!env.openAiApiKey) {
      return { subtasks: fallbackSubtasks(title) };
    }
    try {
      const client = new OpenAI({ apiKey: env.openAiApiKey });
      const response = await client.chat.completions.create({
        model: env.openAiModel,
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: "You are a project manager assistant. Return strict JSON with the shape {\"subtasks\": string[]}.",
          },
          {
            role: "user",
            content: buildPrompt(title, description),
          },
        ],
      });
      const content = response.choices[0]?.message.content;
      if (!content) {
        throw new Error("OpenAI returned an empty response");
      }
      const parsed = responseSchema.parse(JSON.parse(content));
      return parsed;
    } catch (error) {
      console.error("AI generation failed, falling back to deterministic subtasks", error);
      return { subtasks: fallbackSubtasks(title) };
    }
  },
};
