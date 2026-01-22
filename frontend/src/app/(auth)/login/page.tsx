import { Metadata } from "next";
import LoginPage from "./login";

// 🧠 Metadata cho SEO và chia sẻ mạng xã hội
export const metadata: Metadata = {
  title: "Đăng nhập tài khoản | Học Lập Trình",
  description:
    "Đăng nhập vào nền tảng Học Lập Trình để tiếp tục học các khóa học, theo dõi tiến độ và khám phá hàng trăm khóa học chất lượng cao.",
  keywords: [
    "đăng nhập",
    "login",
    "học lập trình",
    "khóa học lập trình",
    "EduSmart",
    "Học Lập Trình",
  ],
  openGraph: {
    title: "Đăng nhập tài khoản | Học Lập Trình",
    description:
      "Truy cập tài khoản của bạn trên Học Lập Trình để học tập, theo dõi tiến độ và tham gia cộng đồng lập trình viên.",
    url: "https://edusmart.vn/login",
    siteName: "Học Lập Trình",
    images: [
      {
        url: "/images/login-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Trang đăng nhập tài khoản Học Lập Trình",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"),
  // Tùy chọn bổ sung giúp SEO mạnh hơn
  robots: {
    index: true,
    follow: true,
  },
};

export default function Page() {
  return <LoginPage />;
}
