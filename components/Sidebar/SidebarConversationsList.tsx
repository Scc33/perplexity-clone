import { Conversation } from "../types";

interface SidebarConversationsListProps {
  conversations: Conversation[];
  onConversationSelect: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  onClose: () => void;
}

export default function SidebarConversationsList({
  conversations,
  onConversationSelect,
  onDeleteConversation,
  onClose,
}: SidebarConversationsListProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="px-4 py-2">
        <h2 className="text-sm font-medium text-gray-400 mb-2">
          Recent Conversations
        </h2>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className="group p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors mb-1 flex items-center justify-between"
          >
            <div
              className="flex-1 min-w-0"
              onClick={() => {
                onConversationSelect(conversation.id);
                onClose();
              }}
            >
              <div className="text-sm font-medium text-gray-200 truncate">
                {conversation.title}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {conversation.timestamp}
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(conversation.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-600 rounded transition-all duration-200 ml-2"
              title="Delete conversation"
            >
              <svg
                className="w-4 h-4 text-gray-400 hover:text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
