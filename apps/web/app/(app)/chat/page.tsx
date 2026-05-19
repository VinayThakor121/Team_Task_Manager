"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "@/context/auth-context";
import { formatDate } from "@/lib/utils";
import { chatService } from "@/services/chat";
import { userService } from "@/services/users";
import { useSocket } from "@/socket/socket-provider";
import type { Conversation, Message, User } from "@/types";
import { PageHeader } from "@/components/common/page-header";
import { LoadingState } from "@/components/common/loading-state";

export default function ChatPage() {
  const { user } = useAuth();
  const { socket, onlineUserIds } = useSocket();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");
  const [messageDraft, setMessageDraft] = useState("");
  const [groupName, setGroupName] = useState("Product Squad");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [typingConversationId, setTypingConversationId] = useState("");
  const [loading, setLoading] = useState(true);
  const endRef = useRef<HTMLDivElement | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation._id === activeConversationId) ?? null,
    [activeConversationId, conversations],
  );

  const loadConversations = useCallback(async (nextActiveConversationId?: string) => {
    const [conversationItems, userItems] = await Promise.all([chatService.listConversations(), userService.search()]);
    setConversations(conversationItems);
    setUsers(userItems.filter((candidate) => candidate.id !== user?.id));
    const fallbackConversationId = nextActiveConversationId || conversationItems[0]?._id || "";
    if (fallbackConversationId) {
      setActiveConversationId(fallbackConversationId);
      const conversationMessages = await chatService.getMessages(fallbackConversationId);
      setMessages(conversationMessages);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    if (!socket) return;

    const handleMessage = (message: Message) => {
      if (message.conversationId === activeConversationId) {
        setMessages((current) => [...current, message]);
      }
      void loadConversations(activeConversationId);
    };

    const handleTyping = ({ conversationId }: { conversationId: string }) => {
      setTypingConversationId(conversationId);
    };

    const handleStopTyping = ({ conversationId }: { conversationId: string }) => {
      if (typingConversationId === conversationId) {
        setTypingConversationId("");
      }
    };

    socket.on("message:new", handleMessage);
    socket.on("conversation:typing", handleTyping);
    socket.on("conversation:stop-typing", handleStopTyping);

    return () => {
      socket.off("message:new", handleMessage);
      socket.off("conversation:typing", handleTyping);
      socket.off("conversation:stop-typing", handleStopTyping);
    };
  }, [activeConversationId, loadConversations, socket, typingConversationId]);

  useEffect(() => {
    if (!socket || !activeConversationId) return;
    socket.emit("conversation:join", activeConversationId);
    return () => {
      socket.emit("conversation:leave", activeConversationId);
    };
  }, [activeConversationId, socket]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const openConversation = async (conversationId: string) => {
    setActiveConversationId(conversationId);
    const conversationMessages = await chatService.getMessages(conversationId);
    setMessages(conversationMessages);
  };

  const createDirectConversation = async () => {
    if (!selectedUserId) return;
    const conversation = await chatService.createDirect(selectedUserId);
    setSelectedUserId("");
    await loadConversations(conversation._id);
  };

  const createGroupConversation = async () => {
    if (!groupMembers.length) return;
    const conversation = await chatService.createGroup(groupName, groupMembers);
    setGroupMembers([]);
    await loadConversations(conversation._id);
  };

  const sendMessage = async () => {
    if (!activeConversationId || !messageDraft.trim()) return;
    const message = await chatService.sendMessage(activeConversationId, messageDraft.trim());
    setMessages((current) => [...current, message]);
    setMessageDraft("");
    socket?.emit("message:stop-typing", activeConversationId);
    await loadConversations(activeConversationId);
  };

  if (loading) {
    return <LoadingState label="Loading conversations..." />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Chat"
        title="Talk through delivery in real time"
        description="Use direct and group chat to keep project decisions, unblockers, and updates flowing across the team."
      />

      <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20 backdrop-blur">
          <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-violet-300">Personal chat</h2>
            <select value={selectedUserId} onChange={(event) => setSelectedUserId(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-violet-400">
              <option value="">Start a direct conversation</option>
              {users.map((member) => (
                <option key={member.id} value={member.id}>{member.name}</option>
              ))}
            </select>
            <button type="button" onClick={createDirectConversation} className="w-full rounded-full border border-white/10 px-4 py-3 text-sm text-slate-100 hover:bg-white/10">
              Open direct chat
            </button>
          </div>

          {user?.role === "admin" && (
            <div className="space-y-3 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-[0.25em] text-emerald-300">Group chat</h2>
              <input value={groupName} onChange={(event) => setGroupName(event.target.value)} className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-violet-400" />
              <select multiple value={groupMembers} onChange={(event) => setGroupMembers(Array.from(event.target.selectedOptions).map((option) => option.value))} className="min-h-28 w-full rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none focus:border-violet-400">
                {users.map((member) => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
              <button type="button" onClick={createGroupConversation} className="w-full rounded-full bg-violet-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:bg-violet-400">
                Create group
              </button>
            </div>
          )}

          <div className="space-y-3">
            {conversations.map((conversation) => {
              const label = conversation.isGroupChat
                ? conversation.groupName
                : conversation.members.find((member) => member.id !== user?.id)?.name ?? "Direct chat";
              const otherMember = conversation.members.find((member) => member.id !== user?.id);
              const isOnline = otherMember ? onlineUserIds.includes(otherMember.id) : false;
              return (
                <button
                  key={conversation._id}
                  type="button"
                  onClick={() => openConversation(conversation._id)}
                  className={`block w-full rounded-2xl border px-4 py-4 text-left ${
                    activeConversationId === conversation._id
                      ? "border-violet-400/30 bg-violet-500/10"
                      : "border-white/10 bg-slate-950/60"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{label}</p>
                    {conversation.unreadCount ? (
                      <span className="rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-semibold text-white">{conversation.unreadCount}</span>
                    ) : null}
                  </div>
                  {!conversation.isGroupChat && (
                    <p className={`mt-2 text-xs uppercase tracking-[0.25em] ${isOnline ? "text-emerald-300" : "text-slate-500"}`}>
                      {isOnline ? "Online" : "Offline"}
                    </p>
                  )}
                  <p className="mt-2 line-clamp-2 text-sm text-slate-400">{conversation.latestMessage?.content ?? "No messages yet"}</p>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="flex min-h-[700px] flex-col rounded-3xl border border-white/10 bg-white/5 p-5 shadow-xl shadow-slate-950/20 backdrop-blur">
          {activeConversation ? (
            <>
              <header className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
                <h2 className="text-lg font-semibold text-white">
                  {activeConversation.isGroupChat
                    ? activeConversation.groupName
                    : activeConversation.members.find((member) => member.id !== user?.id)?.name ?? "Direct chat"}
                </h2>
                <p className="mt-1 text-sm text-slate-400">
                  {activeConversation.isGroupChat
                    ? `${activeConversation.members.length} members`
                    : onlineUserIds.includes(activeConversation.members.find((member) => member.id !== user?.id)?.id ?? "")
                      ? "Currently online"
                      : "Currently offline"}
                </p>
              </header>
              <div className="mt-4 flex-1 space-y-3 overflow-y-auto rounded-3xl border border-white/10 bg-slate-950/60 p-4">
                {messages.map((message) => {
                  const mine = message.sender.id === user?.id;
                  return (
                    <div key={message._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-xl rounded-3xl px-4 py-3 ${mine ? "bg-violet-500 text-white" : "bg-white/10 text-slate-100"}`}>
                        <p className="text-xs uppercase tracking-[0.2em] text-white/70">{message.sender.name}</p>
                        <p className="mt-2 text-sm leading-6">{message.content}</p>
                        <p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-white/60">{formatDate(message.createdAt)}</p>
                      </div>
                    </div>
                  );
                })}
                {typingConversationId === activeConversationId && (
                  <p className="text-sm text-slate-400">Someone is typing…</p>
                )}
                <div ref={endRef} />
              </div>
              <div className="mt-4 flex gap-3">
                <input
                  value={messageDraft}
                  onChange={(event) => {
                    setMessageDraft(event.target.value);
                    if (activeConversationId) {
                      socket?.emit("message:typing", activeConversationId);
                    }
                  }}
                  onBlur={() => activeConversationId && socket?.emit("message:stop-typing", activeConversationId)}
                  placeholder="Send a message"
                  className="flex-1 rounded-2xl border border-white/10 bg-slate-950/80 px-4 py-3 text-white outline-none focus:border-violet-400"
                />
                <button onClick={sendMessage} className="rounded-full bg-violet-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-violet-500/30 hover:bg-violet-400">
                  Send
                </button>
              </div>
            </>
          ) : (
            <LoadingState label="Open or create a conversation to begin chatting." />
          )}
        </section>
      </div>
    </div>
  );
}
