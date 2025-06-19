import WelcomeMessage from "./WelcomeMessage";
import ChatMessage from "./ChatMessage";
import { Message } from "../types";

interface ChatHistoryProps {
  onSuggestionClick: (suggestion: string) => void;
  messages: Message[];
}

export default function ChatHistory({
  onSuggestionClick,
  messages,
}: ChatHistoryProps) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        {messages.length === 0 ? (
          /* Welcome Message */
          <WelcomeMessage onSuggestionClick={onSuggestionClick} />
        ) : (
          /* Chat Messages */
          <div className="space-y-4">
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
