import { Metadata } from "next";
import SignupPage from "./signup";

// 🧠 Metadata cho SEO và chia sẻ mạng xã hội
export const metadata: Metadata = {
  title: "Đăng ký tài khoản | Học Lập Trình",
  description:
    "Tạo tài khoản miễn phí để bắt đầu học lập trình trực tuyến cùng hàng ngàn học viên khác. Cập nhật hồ sơ, tham gia khóa học và phát triển kỹ năng của bạn.",
  keywords: [
    "đăng ký",
    "tạo tài khoản",
    "học lập trình online",
    "khóa học lập trình",
    "học lập trình web",
    "Học Lập Trình",
  ],
  openGraph: {
    title: "Đăng ký tài khoản | Học Lập Trình",
    description:
      "Tham gia nền tảng Học Lập Trình — nơi hàng ngàn học viên đang cùng nhau học và chia sẻ kiến thức lập trình.",
    url: "https://edusmart.vn/signup",
    siteName: "Học Lập Trình",
    images: [
      {
        url: "/images/signup-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Trang đăng ký tài khoản Học Lập Trình",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"),
};

export default function Page() {
  return <SignupPage />;
}
