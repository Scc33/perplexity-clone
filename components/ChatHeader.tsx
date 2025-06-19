import { Message } from "../types";

interface ChatHeaderProps {
  messages: Message[];
  title?: string;
  subtitle?: string;
  onMenuClick: () => void;
}

export default function ChatHeader({
  messages = [],
  title,
  subtitle = "Ask me anything...",
  onMenuClick,
}: ChatHeaderProps) {
  // Get the first user message as the title
  const firstUserMessage = messages.find((msg) => msg.role === "user");

  return (
    <div className="border-b border-gray-700 p-4">
      <div className="max-w-4xl mx-auto flex items-center gap-4">
        {/* Hamburger Menu Button (Mobile Only) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Title */}
        <div className="flex-1">
          <h2 className="text-lg font-medium truncate">
            {firstUserMessage?.content || title || "New Chat"}
          </h2>
          <p className="text-sm text-gray-400">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}
