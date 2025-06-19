"use client";

import { useState } from "react";
import { Conversation, Message } from "../types";
import SideBar from "../components/SideBar";
import ChatHistory from "../components/ChatHistory";
import ChatInput from "../components/ChatInput";
import ChatHeader from "../components/ChatHeader";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([
    { id: "1", title: "How to build a React app", timestamp: "2 hours ago" },
    { id: "2", title: "Best practices for TypeScript", timestamp: "1 day ago" },
    { id: "3", title: "CSS Grid vs Flexbox", timestamp: "3 days ago" },
  ]);
  const [messages, setMessages] = useState<{
    [conversationId: string]: Message[];
  }>({});
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getCurrentMessages = () => {
    return currentConversationId ? messages[currentConversationId] || [] : [];
  };

  const handleSendMessage = async () => {
    if (currentMessage.trim()) {
      setIsLoading(true);
      const messageId = Date.now().toString();
      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // Create user message
      const userMessage: Message = {
        id: messageId,
        content: currentMessage,
        role: "user",
        timestamp,
      };

      // Create or update conversation
      const conversationId = currentConversationId || messageId;
      const conversationTitle =
        currentMessage.slice(0, 50) + (currentMessage.length > 50 ? "..." : "");

      if (!currentConversationId) {
        // Create new conversation
        const newConversation: Conversation = {
          id: conversationId,
          title: conversationTitle,
          timestamp: "Just now",
        };
        setConversations([newConversation, ...conversations]);
        setCurrentConversationId(conversationId);
      }

      // Add message to conversation
      const conversationMessages = messages[conversationId] || [];
      const updatedMessages = [...conversationMessages, userMessage];
      setMessages({
        ...messages,
        [conversationId]: updatedMessages,
      });

      setCurrentMessage("");

      // Add loading message
      const loadingMessageId = (Date.now() + 1).toString();
      const loadingMessage: Message = {
        id: loadingMessageId,
        content: "",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        isLoading: true,
      };

      setMessages((prev) => ({
        ...prev,
        [conversationId]: [...(prev[conversationId] || []), loadingMessage],
      }));

      try {
        // Make API call to Gemini
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: updatedMessages,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to get response from AI");
        }

        const data = await response.json();

        // Replace loading message with actual response
        const assistantMessage: Message = {
          id: loadingMessageId,
          content: data.content,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [
            ...(prev[conversationId] || []).filter(
              (msg) => msg.id !== loadingMessageId
            ),
            assistantMessage,
          ],
        }));
      } catch (error) {
        console.error("Error calling AI API:", error);

        // Replace loading message with error message
        const errorMessage: Message = {
          id: loadingMessageId,
          content:
            "Sorry, I encountered an error while processing your request. Please try again.",
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };

        setMessages((prev) => ({
          ...prev,
          [conversationId]: [
            ...(prev[conversationId] || []).filter(
              (msg) => msg.id !== loadingMessageId
            ),
            errorMessage,
          ],
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleNewChat = () => {
    setCurrentConversationId(null);
    setCurrentMessage("");
    setIsSidebarOpen(false);
  };

  const handleConversationSelect = (conversationId: string) => {
    setCurrentConversationId(conversationId);
    setCurrentMessage("");
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <SideBar
        conversations={conversations}
        onNewChat={handleNewChat}
        onConversationSelect={handleConversationSelect}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <ChatHeader
          messages={getCurrentMessages()}
          onMenuClick={toggleSidebar}
        />

        {/* Chat Messages Area */}
        <ChatHistory
          onSuggestionClick={handleSuggestionClick}
          messages={getCurrentMessages()}
        />

        {/* Chat Input */}
        <ChatInput
          currentMessage={currentMessage}
          onMessageChange={setCurrentMessage}
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
}
