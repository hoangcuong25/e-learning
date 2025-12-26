import { Metadata } from "next";
import Profile from "./Profile";

// 🧠 Metadata cho SEO và chia sẻ mạng xã hội
export const metadata: Metadata = {
  title: "Hồ sơ cá nhân | Học Lập Trình",
  description:
    "Xem và chỉnh sửa hồ sơ cá nhân của bạn. Cập nhật thông tin, đổi mật khẩu và xác thực tài khoản trên nền tảng Học Lập Trình.",
  keywords: [
    "hồ sơ cá nhân",
    "thông tin người dùng",
    "đổi mật khẩu",
    "chỉnh sửa hồ sơ",
    "xác thực tài khoản",
    "Học Lập Trình",
  ],
  openGraph: {
    title: "Hồ sơ cá nhân | Học Lập Trình",
    description:
      "Quản lý thông tin cá nhân và tài khoản học tập của bạn trên Học Lập Trình.",
    url: "https://edusmart.vn/profile",
    siteName: "Học Lập Trình",
    images: [
      {
        url: "/images/user-profile-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Hồ sơ cá nhân tại Học Lập Trình",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"),
};

export default function Page() {
  return <Profile />;
}
