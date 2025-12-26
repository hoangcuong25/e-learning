import React from "react";
import UserSidebar from "@/components/user/UserSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50 mt-4">
      {/* Sidebar */}
      <aside className="hidden md:block w-96 p-6 bg-white border-r border-gray-200">
        <UserSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
