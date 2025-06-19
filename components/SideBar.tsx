import { Conversation } from "../types";

interface SideBarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onConversationSelect: (conversationId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

export default function SideBar({
  conversations,
  onNewChat,
  onConversationSelect,
  isOpen,
  onClose,
}: SideBarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:static inset-y-0 left-0 w-80 bg-gray-800 border-r border-gray-700 flex flex-col z-30 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <h1 className="text-xl font-semibold">Perplexity Clone</h1>
          </div>
        </div>

        {/* New Chat Button */}
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

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-2">
            <h2 className="text-sm font-medium text-gray-400 mb-2">
              Recent Conversations
            </h2>
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className="p-3 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors mb-1"
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
            ))}
          </div>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-700 cursor-pointer transition-colors">
            <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm">👤</span>
            </div>
            <div>
              <div className="text-sm font-medium">User</div>
              <div className="text-xs text-gray-500">user@example.com</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
