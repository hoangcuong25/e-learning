import SidebarAdmin from "@/components/admin/Sidebar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    default: "Admin Dashboard | MyApp",
    template: "%s | Admin Dashboard",
  },
  description:
    "Trang quản trị hệ thống của MyApp, nơi bạn có thể quản lý người dùng, bài viết và khóa học.",
  openGraph: {
    title: "Admin Dashboard | MyApp",
    description:
      "Quản trị hệ thống MyApp — nơi bạn quản lý nội dung, người dùng và thống kê.",
    type: "website",
    url: "https://myapp.com/admin",
    siteName: "MyApp Admin",
  },
  robots: {
    index: false, // Không cho SEO index trang admin
    follow: false,
  },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SidebarAdmin />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}
