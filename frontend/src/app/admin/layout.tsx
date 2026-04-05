import SidebarAdmin from "@/components/admin/Sidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Quản trị hệ thống | EduSmart",
    template: "%s | Admin Dashboard",
  },
  description:
    "Trang quản trị hệ thống của EduSmart, nơi bạn có thể quản lý người dùng, bài viết và khóa học.",
  openGraph: {
    title: "Admin Dashboard | EduSmart",
    description:
      "Quản trị hệ thống EduSmart — nơi bạn quản lý nội dung, người dùng và thống kê.",
    type: "website",
    url: "https://edusmart.vn/admin",
    siteName: "EduSmart Admin",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-200 selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Sidebar - Hidden on mobile, visible on desktop */}
      <aside className="hidden xl:block w-72 flex-shrink-0 sticky top-0 h-screen p-6 border-r border-slate-900 bg-slate-950/50 backdrop-blur-xl">
        <SidebarAdmin />
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminNavbar />
        <main className="flex-1 p-8 overflow-y-auto custom-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
