import { Conversation } from "../types";
import SidebarHeader from "./SidebarHeader";
import NewChatButton from "./NewChatButton";
import SidebarConversationsList from "./SidebarConversationsList";
import SidebarFooter from "./SidebarFooter";

interface SideBarProps {
  conversations: Conversation[];
  onNewChat: () => void;
  onConversationSelect: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  isNewConversation: boolean;
}

export default function SideBar({
  conversations,
  onNewChat,
  onConversationSelect,
  onDeleteConversation,
  isOpen,
  onClose,
  isNewConversation,
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
        <SidebarHeader />
        {!isNewConversation && <NewChatButton onNewChat={onNewChat} />}
        <SidebarConversationsList
          conversations={conversations}
          onConversationSelect={onConversationSelect}
          onDeleteConversation={onDeleteConversation}
          onClose={onClose}
        />
        <SidebarFooter />
      </div>
    </>
  );
}
