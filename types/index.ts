export interface Conversation {
  id: string;
  title: string;
  timestamp: string;
}

export interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  isLoading?: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
}

export interface SearchAnalysis {
  needsSearch: boolean;
  searchQuery: string;
  reasoning: string;
}

export interface EnhancedMessage extends Message {
  searchAnalysis?: SearchAnalysis;
}
