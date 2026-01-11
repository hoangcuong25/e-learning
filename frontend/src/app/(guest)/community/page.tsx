import CommunityGate from "@/components/community/CommunityGate";
import CommunityFeed from "@/components/community/CommunityFeed";
import CommunityTabs from "@/components/community/CommunityTabs";

export const metadata = {
  title: "Cộng đồng học tập | EduSmart",
  description:
    "Cộng đồng EduSmart – nơi học viên và giảng viên đăng bài, thảo luận, thích và bình luận như một mạng xã hội học tập.",
  openGraph: {
    title: "Cộng đồng học tập | EduSmart",
    description:
      "Tham gia cộng đồng EduSmart để trao đổi kiến thức, đặt câu hỏi và kết nối với hàng ngàn học viên khác.",
    url: "https://edusmart.vn/community",
    siteName: "EduSmart",
    images: [
      {
        url: "https://res.cloudinary.com/dlb9cguid/image/upload/v1734351000/opengraph-community.png",
        width: 1200,
        height: 630,
        alt: "EduSmart Community",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cộng đồng học tập | EduSmart",
    description:
      "Nơi chia sẻ kiến thức và kết nối đam mê học tập. Tham gia ngay!",
    images: [
      "https://res.cloudinary.com/dlb9cguid/image/upload/v1734351000/opengraph-community.png",
    ],
  },
};

// 🔹 CSR PAGE
export default function CommunityPage() {
  return (
    <div className="space-y-16 my-6">
      <CommunityGate />

      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT: Tabs + Search + Create */}
        <aside className="lg:col-span-3 space-y-4">
          <CommunityTabs />
        </aside>

        {/* CENTER: Feed */}
        <div className="lg:col-span-6 space-y-6">
          <CommunityFeed />
        </div>

        {/* RIGHT: Suggestions */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Gợi ý theo dõi</h3>
            <ul className="space-y-3">
              {["Giảng viên React", "AI Expert", "Web Career"].map((item) => (
                <li key={item} className="flex justify-between items-center">
                  <span className="text-gray-600">{item}</span>
                  <button className="text-blue-600 text-sm font-medium">
                    Theo dõi
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </section>
    </div>
  );
}
