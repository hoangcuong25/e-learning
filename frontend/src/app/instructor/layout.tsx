import InstructorSidebar from "@/components/instructor/InstructorSidebar";
import InstructorNavbar from "@/components/instructor/InstructorNavbar";
import type { Metadata } from "next";

// Metadata áp dụng cho toàn bộ khu vực giảng viên
export const metadata: Metadata = {
  title: {
    default: "Bảng điều khiển giảng viên | Học Lập Trình",
    template: "%s | Giảng viên - Học Lập Trình",
  },
  description:
    "Quản lý khóa học, bài học và học viên của bạn trong bảng điều khiển giảng viên. Tạo nội dung chất lượng và chia sẻ kiến thức lập trình dễ dàng.",
  openGraph: {
    title: "Bảng điều khiển giảng viên | Học Lập Trình",
    description:
      "Truy cập khu vực giảng viên để quản lý khóa học, bài học và học viên của bạn trên Học Lập Trình.",
    url: "https://yourdomain.com/instructor",
    siteName: "Học Lập Trình",
    images: [
      {
        url: "/images/instructor-dashboard.jpg",
        width: 1200,
        height: 630,
        alt: "Bảng điều khiển giảng viên Học Lập Trình",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  robots: {
    index: false, // Không cho SEO index trang giảng viên
    follow: false,
  },
  metadataBase: new URL("https://yourdomain.com"),
};

export default function InstructorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="hidden xl:block">
        <InstructorSidebar />
      </div>
      <div className="flex-1 flex flex-col">
        <InstructorNavbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
