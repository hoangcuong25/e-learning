import { Clock, ShieldCheck, ChevronRight, Layout, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

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
    url: "https://edusmart.vn/instructor/status",
    siteName: "EduSmart",
    images: [
      {
        url: "/elearning-banner.png",
        width: 1200,
        height: 630,
        alt: "EduSmart Instructor Status Banner",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"),
};

const Page = () => {
  return (
    <div className="min-h-[85vh] flex items-center justify-center p-6 bg-slate-50/30">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-xl w-full"
      >
        <div className="bg-white rounded-[3.5rem] p-12 md:p-16 border border-slate-100 shadow-2xl text-center space-y-10 relative overflow-hidden group">
          {/* Decorative Background */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500 opacity-5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-600 opacity-5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

          {/* Icon Stage */}
          <div className="relative">
            <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-indigo-600/5 group-hover:rotate-12 transition-transform duration-500">
               <Clock size={40} strokeWidth={1.5} className="animate-pulse" />
            </div>
            <div className="absolute -top-2 right-[38%] w-8 h-8 bg-white rounded-full shadow-sm flex items-center justify-center text-amber-500 border border-slate-50">
               <Sparkles size={16} fill="currentColor" />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white rounded-full text-[9px] font-black uppercase tracking-[0.2em] mb-2">
                <ShieldCheck size={12} className="text-indigo-400" />
                Security Verification
             </div>
             <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-none">
               Đơn của bạn đang được xét duyệt.
             </h2>
             <p className="text-slate-400 font-medium text-lg tracking-tight max-w-sm mx-auto leading-relaxed">
               Hệ thống đang kiểm tra thông tin đăng ký giảng viên của bạn. Kết quả sẽ được gửi sau 1–3 ngày làm việc.
             </p>
          </div>

          {/* Action */}
          <div className="pt-6 relative z-10">
            <Link href="/my-learning">
              <button className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px] transition-all flex items-center gap-3 mx-auto group">
                <Layout size={16} /> Quay lại học tập <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
          </div>

          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest pt-4">
            EduSmart Quality Control Division
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Page;
