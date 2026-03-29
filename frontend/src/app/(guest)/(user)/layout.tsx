import React from "react";
import UserSidebar from "@/components/user/UserSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 px-4 md:px-6 lg:px-10 pb-20 pt-10">
      <div className="max-w-8xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12">
        {/* Sidebar */}
        <aside className="w-full lg:w-[320px] lg:sticky lg:top-32 h-fit shrink-0">
          <UserSidebar />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}

