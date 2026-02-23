import React from "react";
import UserSidebar from "@/components/user/UserSidebar";

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 mt-4">
      {/* Sidebar */}
      <aside className="w-full lg:w-80 p-4 lg:p-6 bg-white border-b lg:border-b-0 lg:border-r border-gray-200">
        <UserSidebar />
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 lg:p-8">{children}</main>
    </div>
  );
}
