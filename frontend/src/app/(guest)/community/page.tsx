"use client";

import CommunityGate from "@/components/community/CommunityGate";
import CommunityFeed from "@/components/community/post/CommunityFeed";
import ChatContainer from "@/components/community/chat/ChatContainer";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function CommunityPage() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  return (
    <div className="space-y-6">
      <CommunityGate />
      <Suspense fallback={<div>Loading...</div>}>
        {view === "chat" ? <ChatContainer /> : <CommunityFeed />}
      </Suspense>
    </div>
  );
}
