import { Suspense } from "react";
import ChatClient from "../components/Chat/ChatClient";
import ChatSkeleton from "../components/Chat/ChatSkeleton";

export default function Home() {
  return (
    <Suspense fallback={<ChatSkeleton />}>
      <ChatClient />
    </Suspense>
  );
}
