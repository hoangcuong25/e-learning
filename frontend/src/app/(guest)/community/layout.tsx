"use client";

import CommunitySidebar from "@/components/community/CommunitySidebar";
import FollowSuggestions from "@/components/community/follow/FollowSuggestions";
import { MobileCommunitySidebar } from "@/components/community/MobileCommunitySidebar";
import { Suspense } from "react";

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 relative">
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
          <Suspense fallback={<div className="h-[400px] bg-slate-900/50 rounded-2xl animate-pulse" />}>
            <CommunitySidebar />
          </Suspense>
        </aside>

        <Suspense fallback={<div className="h-12 bg-slate-900/50 rounded-xl mb-2 animate-pulse lg:hidden" />}>
          <MobileCommunitySidebar />
        </Suspense>

        {/* CENTER (page content) */}
        <main className="lg:col-span-6 space-y-5">{children}</main>

        {/* RIGHT */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-24 self-start">
          <FollowSuggestions />
        </aside>
      </section>
    </div>
  );
}
