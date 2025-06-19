interface NewChatButtonProps {
  onNewChat: () => void;
}

export default function NewChatButton({ onNewChat }: NewChatButtonProps) {
  return (
    <div className="p-4">
      <button
        onClick={onNewChat}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
        New Chat
      </button>
    </div>
  );
}
