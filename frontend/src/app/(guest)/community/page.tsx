import { Users, Heart, MessageCircle, Share2 } from "lucide-react";
import CommunityGate from "@/components/community/CommunityGate";
import CommunityFeed from "@/components/community/CommunityFeed";
import banner from "@public/elearning-banner.png";
import Image from "next/image";

export const metadata = {
  title: "Cộng đồng học tập | EduSmart",
  description:
    "Cộng đồng EduSmart – nơi học viên và giảng viên đăng bài, thảo luận, thích và bình luận như một mạng xã hội học tập.",
};

// 🔹 SSR PAGE
export default function CommunityPage() {
  return (
    <div className="space-y-16 my-6">
      <CommunityGate />

      {/* Feed Layout */}
      <section className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-gray-800 mb-3">Danh mục</h3>
            <ul className="space-y-2 text-gray-600">
              <li>#laptrinh</li>
              <li>#marketing</li>
              <li>#ai</li>
              <li>#career</li>
            </ul>
          </div>
        </aside>

        {/* Feed – CLIENT COMPONENT */}
        <div className="lg:col-span-6 space-y-6">
          <CommunityFeed />
        </div>

        {/* Right Sidebar */}
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
