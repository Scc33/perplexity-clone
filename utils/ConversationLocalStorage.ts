import { Conversation, Message } from "../types";
import {
  saveToLocalStorage,
  loadFromLocalStorage,
  removeFromLocalStorage,
  getTimeAgo,
} from "./LocalStorageUtils";

// Storage keys
const CONVERSATIONS_KEY = "perplexity_clone_conversations";
const MESSAGES_KEY = "perplexity_clone_messages";

// Conversations storage
export const saveConversations = (conversations: Conversation[]): void => {
  saveToLocalStorage(CONVERSATIONS_KEY, conversations);
};

export const loadConversations = (): Conversation[] => {
  return loadFromLocalStorage<Conversation[]>(CONVERSATIONS_KEY, []);
};

// Messages storage
export const saveMessages = (messages: {
  [conversationId: string]: Message[];
}): void => {
  saveToLocalStorage(MESSAGES_KEY, messages);
};

export const loadMessages = (): { [conversationId: string]: Message[] } => {
  return loadFromLocalStorage<{ [conversationId: string]: Message[] }>(
    MESSAGES_KEY,
    {}
  );
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

// Helper to clear all conversation data
export const clearConversationData = (): void => {
  removeFromLocalStorage(CONVERSATIONS_KEY);
  removeFromLocalStorage(MESSAGES_KEY);
};

// Helper to get storage usage info
export const getConversationStorageInfo = (): {
  conversations: number;
  messages: number;
  totalSize: number;
} => {
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
    console.error("Failed to get conversation storage info:", error);
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

// Test function to verify conversation localStorage functionality
export const testConversationLocalStorage = (): boolean => {
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
    console.error("Conversation localStorage test failed:", error);
    return false;
  }
};
