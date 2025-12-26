import { Metadata } from "next";
import InstructorApplyPage from "./Apply";

// 🧠 Metadata cho SEO và chia sẻ mạng xã hội
export const metadata: Metadata = {
  title: "Đăng ký trở thành giảng viên | Học Lập Trình",
  description:
    "Gửi đơn đăng ký để trở thành giảng viên tại Học Lập Trình. Chia sẻ kinh nghiệm, tạo khóa học và bắt đầu hành trình giảng dạy trực tuyến.",
  keywords: [
    "đăng ký giảng viên",
    "trở thành giảng viên",
    "giảng dạy lập trình",
    "tạo khóa học online",
    "Học Lập Trình",
  ],
  openGraph: {
    title: "Đăng ký trở thành giảng viên | Học Lập Trình",
    description:
      "Gia nhập đội ngũ giảng viên và chia sẻ kiến thức lập trình của bạn đến hàng ngàn học viên.",
    url: "https://yourdomain.com/apply-instructor",
    siteName: "Học Lập Trình",
    images: [
      {
        url: "/images/apply-instructor-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Đăng ký trở thành giảng viên tại Học Lập Trình",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"), // Đặt domain của bạn ở đây
};

export default function Page() {
  return <InstructorApplyPage />;
}
