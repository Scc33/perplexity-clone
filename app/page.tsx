"use client";

import { useState, useEffect } from "react";
import { Conversation, Message } from "../types";
import SideBar from "../components/SideBar";
import ChatHistory from "../components/ChatHistory";
import ChatInput from "../components/ChatInput";
import ChatHeader from "../components/ChatHeader";
import {
  loadConversations,
  saveConversations,
  loadMessages,
  saveMessages,
  saveConversation,
  saveConversationMessages,
  deleteConversation,
  updateConversationTimestamp,
  updateConversationTitle,
} from "../utils/ConversationLocalStorage";

export default function Home() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<{
    [conversationId: string]: Message[];
  }>({});
  const [currentConversationId, setCurrentConversationId] = useState<
    string | null
  >(null);
  const [currentMessage, setCurrentMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedConversations = loadConversations();
    const savedMessages = loadMessages();

    setConversations(savedConversations);
    setMessages(savedMessages);
  }, []);

  // Save conversations whenever they change
  useEffect(() => {
    if (conversations.length > 0) {
      saveConversations(conversations);
    }
  }, [conversations]);

  // Save messages whenever they change
  useEffect(() => {
    if (Object.keys(messages).length > 0) {
      saveMessages(messages);
    }
  }, [messages]);

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

        // Save the new conversation to localStorage
        saveConversation(newConversation);
      } else {
        // Update conversation title if this is the first message
        const conversationMessages = messages[conversationId] || [];
        if (conversationMessages.length === 0) {
          updateConversationTitle(conversationId, currentMessage);
        }
      }

      // Add message to conversation
      const conversationMessages = messages[conversationId] || [];
      const updatedMessages = [...conversationMessages, userMessage];
      setMessages({
        ...messages,
        [conversationId]: updatedMessages,
      });

      // Save messages to localStorage
      saveConversationMessages(conversationId, updatedMessages);

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

      const messagesWithLoading = [...updatedMessages, loadingMessage];
      setMessages((prev) => ({
        ...prev,
        [conversationId]: messagesWithLoading,
      }));

      // Save loading state to localStorage
      saveConversationMessages(conversationId, messagesWithLoading);

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

        const finalMessages = [...updatedMessages, assistantMessage];
        setMessages((prev) => ({
          ...prev,
          [conversationId]: finalMessages,
        }));

        // Save final messages to localStorage
        saveConversationMessages(conversationId, finalMessages);
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

        const errorMessages = [...updatedMessages, errorMessage];
        setMessages((prev) => ({
          ...prev,
          [conversationId]: errorMessages,
        }));

        // Save error messages to localStorage
        saveConversationMessages(conversationId, errorMessages);
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

    // Update timestamp when conversation is accessed
    updateConversationTimestamp(conversationId);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setCurrentMessage(suggestion);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Add function to handle conversation deletion
  const handleDeleteConversation = (conversationId: string) => {
    // Remove from state
    setConversations((prev) => prev.filter((c) => c.id !== conversationId));
    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages[conversationId];
      return newMessages;
    });

    // If we're deleting the current conversation, clear it
    if (currentConversationId === conversationId) {
      setCurrentConversationId(null);
    }

    // Remove from localStorage
    deleteConversation(conversationId);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <SideBar
        conversations={conversations}
        onNewChat={handleNewChat}
        onConversationSelect={handleConversationSelect}
        onDeleteConversation={handleDeleteConversation}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isNewConversation={currentConversationId === null}
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
