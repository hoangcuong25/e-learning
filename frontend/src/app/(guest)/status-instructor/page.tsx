import { Clock } from "lucide-react";

// 🧭 Metadata SEO cho trang
export const metadata = {
  title: "Trạng thái giảng viên | EduSmart",
  description:
    "Kiểm tra trạng thái đơn đăng ký giảng viên của bạn trên EduSmart. Xem kết quả phê duyệt hoặc gửi lại đơn đăng ký nhanh chóng.",
  keywords: [
    "EduSmart",
    "trạng thái giảng viên",
    "đơn đăng ký giảng viên",
    "phê duyệt tài khoản",
    "trở thành giảng viên",
    "dạy học online",
  ],
  openGraph: {
    title: "Trạng thái giảng viên | EduSmart",
    description:
      "Theo dõi tiến trình phê duyệt đơn đăng ký giảng viên của bạn trên nền tảng EduSmart.",
    url: "https://edusmart.vn/instructor/status", // 🟦 Thay domain thật của bạn
    siteName: "EduSmart",
    images: [
      {
        url: "/elearning-banner.png", // Ảnh trong thư mục /public
        width: 1200,
        height: 630,
        alt: "EduSmart Instructor Status Banner",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"), // ⚠️ Thay domain thực tế của bạn
};

const Page = () => {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-10 max-w-lg w-full text-center space-y-4">
        <Clock className="w-12 h-12 text-yellow-500 mx-auto" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Đơn của bạn đang chờ phê duyệt
        </h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Cảm ơn bạn đã gửi đơn đăng ký trở thành giảng viên. Chúng tôi sẽ xem
          xét và phản hồi trong vòng 1–3 ngày làm việc.
        </p>
      </div>
    </div>
  );
};

export default Page;
