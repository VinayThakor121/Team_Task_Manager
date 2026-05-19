export type UserRole = "admin" | "member";

export interface User {
  _id?: string;
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  createdBy: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  subtasks?: string[];
  assignedTo: User;
  projectId: { _id?: string; title: string } | string;
  priority: "Low" | "Medium" | "High";
  status: "Todo" | "In Progress" | "Completed";
  dueDate: string;
  createdBy: User;
  createdAt: string;
  updatedAt: string;
}

export interface Conversation {
  _id: string;
  isGroupChat: boolean;
  groupName?: string;
  members: User[];
  admin?: User;
  latestMessage?: Message;
  unreadCount?: number;
  updatedAt: string;
}

export interface Message {
  _id: string;
  sender: User;
  conversationId: string;
  content: string;
  createdAt: string;
  readBy: string[];
}

export interface DashboardSummary {
  metrics: {
    totalTasks: number;
    completedTasks: number;
    pendingTasks: number;
    overdueTasks: number;
    assignedToMe: number;
  };
  statusBreakdown: {
    todo: number;
    inProgress: number;
    completed: number;
  };
  recentTasks: Task[];
  recentChats: Conversation[];
}
