import { Conversation, Message } from "../types";

// Storage keys
const CONVERSATIONS_KEY = "perplexity_clone_conversations";
const MESSAGES_KEY = "perplexity_clone_messages";

// Helper to check if localStorage is available
const isLocalStorageAvailable = (): boolean => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch {
    return false;
  }
};

// Conversations storage
export const saveConversations = (conversations: Conversation[]): void => {
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available");
    return;
  }

  try {
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(conversations));
  } catch (error) {
    console.error("Failed to save conversations to localStorage:", error);
  }
};

export const loadConversations = (): Conversation[] => {
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available");
    return [];
  }

  try {
    const stored = localStorage.getItem(CONVERSATIONS_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error("Failed to load conversations from localStorage:", error);
    return [];
  }
};

// Messages storage
export const saveMessages = (messages: {
  [conversationId: string]: Message[];
}): void => {
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available");
    return;
  }

  try {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  } catch (error) {
    console.error("Failed to save messages to localStorage:", error);
  }
};

export const loadMessages = (): { [conversationId: string]: Message[] } => {
  if (!isLocalStorageAvailable()) {
    console.warn("LocalStorage is not available");
    return {};
  }

  try {
    const stored = localStorage.getItem(MESSAGES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error("Failed to load messages from localStorage:", error);
    return {};
  }
};

// Helper to save a single conversation
export const saveConversation = (conversation: Conversation): void => {
  const conversations = loadConversations();
  const existingIndex = conversations.findIndex(
    (c) => c.id === conversation.id
  );

  if (existingIndex >= 0) {
    conversations[existingIndex] = conversation;
  } else {
    conversations.unshift(conversation); // Add to beginning
  }

  saveConversations(conversations);
};

// Helper to save messages for a specific conversation
export const saveConversationMessages = (
  conversationId: string,
  messages: Message[]
): void => {
  const allMessages = loadMessages();
  allMessages[conversationId] = messages;
  saveMessages(allMessages);
};

// Helper to delete a conversation and its messages
export const deleteConversation = (conversationId: string): void => {
  // Remove from conversations
  const conversations = loadConversations();
  const filteredConversations = conversations.filter(
    (c) => c.id !== conversationId
  );
  saveConversations(filteredConversations);

  // Remove messages
  const allMessages = loadMessages();
  delete allMessages[conversationId];
  saveMessages(allMessages);
};

// Helper to clear all data
export const clearAllData = (): void => {
  if (!isLocalStorageAvailable()) {
    return;
  }

  try {
    localStorage.removeItem(CONVERSATIONS_KEY);
    localStorage.removeItem(MESSAGES_KEY);
  } catch (error) {
    console.error("Failed to clear localStorage data:", error);
  }
};

// Helper to get storage usage info
export const getStorageInfo = (): {
  conversations: number;
  messages: number;
  totalSize: number;
} => {
  if (!isLocalStorageAvailable()) {
    return { conversations: 0, messages: 0, totalSize: 0 };
  }

  try {
    const conversations = loadConversations();
    const messages = loadMessages();
    const totalSize = new Blob([
      JSON.stringify(conversations),
      JSON.stringify(messages),
    ]).size;

    return {
      conversations: conversations.length,
      messages: Object.keys(messages).length,
      totalSize,
    };
  } catch (error) {
    console.error("Failed to get storage info:", error);
    return { conversations: 0, messages: 0, totalSize: 0 };
  }
};

// Helper to update conversation timestamp when accessed
export const updateConversationTimestamp = (conversationId: string): void => {
  const conversations = loadConversations();
  const conversationIndex = conversations.findIndex(
    (c) => c.id === conversationId
  );

  if (conversationIndex >= 0) {
    const now = new Date();
    const timeAgo = getTimeAgo(now);

    conversations[conversationIndex] = {
      ...conversations[conversationIndex],
      timestamp: timeAgo,
    };

    // Move to top of list
    const conversation = conversations.splice(conversationIndex, 1)[0];
    conversations.unshift(conversation);

    saveConversations(conversations);
  }
};

// Helper to update conversation title based on first message
export const updateConversationTitle = (
  conversationId: string,
  firstMessage: string
): void => {
  const conversations = loadConversations();
  const conversationIndex = conversations.findIndex(
    (c) => c.id === conversationId
  );

  if (conversationIndex >= 0) {
    const title =
      firstMessage.slice(0, 50) + (firstMessage.length > 50 ? "..." : "");

    conversations[conversationIndex] = {
      ...conversations[conversationIndex],
      title,
    };

    saveConversations(conversations);
  }
};

// Helper function to get relative time ago
const getTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }
};

// Test function to verify localStorage functionality
export const testLocalStorage = (): boolean => {
  try {
    // Test saving and loading conversations
    const testConversation: Conversation = {
      id: "test-123",
      title: "Test Conversation",
      timestamp: "Just now",
    };

    const testMessages: Message[] = [
      {
        id: "msg-1",
        content: "Hello, this is a test message",
        role: "user",
        timestamp: "12:00 PM",
      },
    ];

    // Save test data
    saveConversation(testConversation);
    saveConversationMessages("test-123", testMessages);

    // Load and verify
    const loadedConversations = loadConversations();
    const loadedMessages = loadMessages();

    const conversationExists = loadedConversations.some(
      (c) => c.id === "test-123"
    );
    const messagesExist =
      loadedMessages["test-123"] && loadedMessages["test-123"].length > 0;

    // Clean up test data
    deleteConversation("test-123");

    return conversationExists && messagesExist;
  } catch (error) {
    console.error("LocalStorage test failed:", error);
    return false;
  }
};
