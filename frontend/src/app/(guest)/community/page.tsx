"use client";

import CommunityGate from "@/components/community/CommunityGate";
import CommunityFeed from "@/components/community/post/CommunityFeed";
import ChatContainer from "@/components/community/chat/ChatContainer";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CommunityPageContent() {
  const searchParams = useSearchParams();
  const view = searchParams.get("view");

  return (
    <div className="space-y-6">
      <CommunityGate />
      <Suspense fallback={<div className="h-40 bg-slate-900/50 rounded-2xl animate-pulse" />}>
        {view === "chat" ? <ChatContainer /> : <CommunityFeed />}
      </Suspense>
    </div>
  );
}

export default function CommunityPage() {
  return (
    <Suspense fallback={<div className="h-60 bg-slate-900/50 rounded-2xl animate-pulse" />}>
      <CommunityPageContent />
    </Suspense>
  );
}
