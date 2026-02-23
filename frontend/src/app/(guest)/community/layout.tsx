import CommunitySidebar from "@/components/community/CommunitySidebar";
import FollowSuggestions from "@/components/community/follow/FollowSuggestions";
import { MobileCommunitySidebar } from "@/components/community/MobileCommunitySidebar";

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

export default function CommunityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="my-6 relative">
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* LEFT */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-64 self-start">
          <CommunitySidebar />
        </aside>
        <MobileCommunitySidebar />

        {/* CENTER (page content) */}
        <main className="lg:col-span-6 space-y-6">{children}</main>

        {/* RIGHT */}
        <aside className="hidden lg:block lg:col-span-3 sticky top-64 self-start">
          <FollowSuggestions />
        </aside>
      </section>
    </div>
  );
}
