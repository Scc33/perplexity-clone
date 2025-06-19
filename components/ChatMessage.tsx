import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-6`}>
      <div className={`max-w-3xl ${isUser ? "order-2" : "order-1"}`}>
        <div
          className={`flex items-start gap-3 ${
            isUser ? "flex-row-reverse" : "flex-row"
          }`}
        >
          {/* Avatar */}
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
              isUser ? "bg-blue-600" : "bg-gray-600"
            }`}
          >
            <span className="text-white text-sm font-medium">
              {isUser ? "U" : "A"}
            </span>
          </div>

          {/* Message Content */}
          <div className={`flex-1 ${isUser ? "text-right" : "text-left"}`}>
            <div
              className={`inline-block p-4 rounded-lg ${
                isUser
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-gray-100 border border-gray-700"
              }`}
            >
              {message.isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Thinking...</span>
                </div>
              ) : (
                <div className="whitespace-pre-wrap">{message.content}</div>
              )}
            </div>
            <div
              className={`text-xs text-gray-500 mt-2 ${
                isUser ? "text-right" : "text-left"
              }`}
            >
              {message.timestamp}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
