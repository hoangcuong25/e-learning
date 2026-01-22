import { Metadata } from "next";
import BecomeInstructorPage from "./Become";

// 🧠 Thêm metadata
export const metadata: Metadata = {
  title: "Trở thành giảng viên | Học Lập Trình",
  description:
    "Chia sẻ kiến thức và bắt đầu hành trình giảng dạy cùng Học Lập Trình. Tạo khóa học, truyền cảm hứng và kiếm thu nhập từ kiến thức của bạn.",
  keywords: [
    "trở thành giảng viên",
    "học lập trình",
    "tạo khóa học online",
    "giảng dạy lập trình",
    "kiếm tiền từ giảng dạy",
  ],
  openGraph: {
    title: "Trở thành giảng viên | Học Lập Trình",
    description:
      "Trở thành giảng viên và chia sẻ kiến thức lập trình của bạn đến hàng ngàn học viên.",
    url: "https://yourdomain.com/become-instructor",
    siteName: "Học Lập Trình",
    images: [
      {
        url: "/images/become-instructor-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Trở thành giảng viên Học Lập Trình",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"), // Đặt domain của bạn ở đây
};

export default function Page() {
  return <BecomeInstructorPage />;
}
