import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { connectDb } from "../config/db";
import { Conversation } from "../models/Conversation";
import { Message } from "../models/Message";
import { Project } from "../models/Project";
import { Task } from "../models/Task";
import { User } from "../models/User";

const run = async () => {
  await connectDb();
  await Promise.all([
    Message.deleteMany({}),
    Conversation.deleteMany({}),
    Task.deleteMany({}),
    Project.deleteMany({}),
    User.deleteMany({}),
  ]);

  const password = await bcrypt.hash("Password123!", 10);
  const [admin, member] = await User.create([
    {
      name: "Alex Admin",
      email: "admin@teamtaskmanager.dev",
      password,
      role: "admin",
    },
    {
      name: "Mina Member",
      email: "member@teamtaskmanager.dev",
      password,
      role: "member",
    },
  ]);

  const project = await Project.create({
    title: "Recruiter Ready Team Task Manager",
    description: "Deliver a polished full-stack collaboration platform.",
    createdBy: admin._id,
    members: [admin._id, member._id],
  });

  await Task.create([
    {
      title: "Build authentication system with RBAC",
      description: "Implement secure login, signup, JWT, and protected routes.",
      subtasks: [
        "Create signup API",
        "Create login API",
        "Setup JWT middleware",
        "Add role-based authorization",
        "Create protected routes",
      ],
      assignedTo: member._id,
      projectId: project._id,
      priority: "High",
      status: "In Progress",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      createdBy: admin._id,
    },
    {
      title: "Design real-time chat UI",
      description: "Ship personal and group chat experiences with presence state.",
      assignedTo: admin._id,
      projectId: project._id,
      priority: "Medium",
      status: "Todo",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
      createdBy: admin._id,
    },
  ]);

  const conversation = await Conversation.create({
    isGroupChat: false,
    members: [admin._id, member._id],
  });

  const message = await Message.create({
    conversationId: conversation._id,
    sender: admin._id,
    content: "Welcome to the Team Task Manager demo workspace!",
    readBy: [admin._id, member._id],
  });

  conversation.latestMessage = message._id;
  await conversation.save();

  console.log("Seed complete");
  console.log({
    adminEmail: "admin@teamtaskmanager.dev",
    memberEmail: "member@teamtaskmanager.dev",
    password: "Password123!",
  });

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
