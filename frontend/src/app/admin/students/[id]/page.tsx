"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchStudentDetailForAdmin,
  toggleBlockUserStatus,
} from "@/store/slice/common/userSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Mail,
  Phone,
  Calendar,
  MapPin,
  User,
  Wallet,
  BookOpen,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Loader2,
  ExternalLink,
  MessageSquare,
  Ban,
  ShieldAlert,
  CreditCard,
  Target,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "sonner";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const StudentDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { studentDetail: student, loading } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchStudentDetailForAdmin(+id));
    }
  }, [dispatch, id]);

  const handleToggleBlock = async () => {
    if (!student) return;

    try {
      const result = await dispatch(
        toggleBlockUserStatus({
          userId: student.id,
          isBlocked: !student.isBlocked,
        }),
      ).unwrap();

      toast.success(
        result.isBlocked
          ? "Đã khóa tài khoản thành công"
          : "Đã mở khóa tài khoản thành công",
        {
          description: `Tài khoản ${student.fullname} đã được ${result.isBlocked ? "khóa" : "kích hoạt lại"}.`,
        },
      );
    } catch (error: any) {
      toast.error(error || "Không thể thay đổi trạng thái tài khoản");
    }
  };

  if (loading && !student) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-indigo-600/10 rounded-3xl animate-spin">
          <Loader2 className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Đang tải hồ sơ học viên...
        </p>
      </div>
    );
  }

  if (!student && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] opacity-50">
          <ShieldAlert size={64} className="text-rose-500" />
        </div>
        <p className="text-xl font-black text-white uppercase tracking-tight">
          Không tìm thấy thông tin
        </p>
        <button
          onClick={() => router.back()}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Top Navigation & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20 uppercase">
                Học viên #{student.id}
              </span>
              {student.isBlocked && (
                <span className="flex items-center gap-1 text-[8px] font-black text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-lg border border-rose-500/20 uppercase tracking-widest">
                  <Ban size={10} /> ĐÃ KHÓA
                </span>
              )}
              {student.isVerified ? (
                <span className="flex items-center gap-1 text-[8px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20 uppercase tracking-widest">
                  <ShieldCheck size={10} /> Đã xác thực
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[8px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 uppercase tracking-widest">
                  Chưa xác thực
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
              HỒ SƠ <span className="text-indigo-500">CHI TIẾT</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            disabled={loading}
            onClick={handleToggleBlock}
            className={`flex-1 md:flex-none px-6 py-3 border rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl flex items-center justify-center gap-2
              ${
                student.isBlocked
                  ? "bg-emerald-600/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white shadow-emerald-500/10"
                  : "bg-rose-600/10 border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white shadow-rose-500/10"
              }`}
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : student.isBlocked ? (
              <ShieldCheck size={14} />
            ) : (
              <Ban size={14} />
            )}
            {student.isBlocked ? "Mở khóa tài khoản" : "Khóa tài khoản"}
          </button>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Tổng chi tiêu",
            value: formatCurrency(student.stats?.totalSpent || 0),
            icon: Wallet,
            color: "text-indigo-400",
          },
          {
            label: "Khóa học tham gia",
            value: student.stats?.totalCourses || 0,
            icon: BookOpen,
            color: "text-blue-400",
          },
          {
            label: "Khóa học hoàn thành",
            value: student.stats?.completedCourses || 0,
            icon: CheckCircle2,
            color: "text-emerald-400",
          },
          {
            label: "Số dư hiện tại",
            value: formatCurrency(student.walletBalance || 0),
            icon: CreditCard,
            color: "text-amber-400",
          },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-slate-900 border border-slate-800 p-6 rounded-[2.5rem] flex items-center gap-4 group hover:border-slate-700 transition-all shadow-xl"
          >
            <div
              className={`p-4 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform ${stat.color}`}
            >
              <stat.icon size={22} />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1.5">
                {stat.label}
              </p>
              <p className="text-xl font-black text-white tracking-tight truncate">
                {stat.value}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 space-y-6"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600/20 to-transparent" />
            <div className="p-8 pt-12 relative z-10 flex flex-col items-center">
              <div className="relative group">
                <Avatar className="w-32 h-32 border-4 border-slate-950 shadow-2xl transition-all duration-500 group-hover:rotate-6">
                  <AvatarImage src={student.avatar} className="object-cover" />
                  <AvatarFallback className="bg-slate-800 text-indigo-400 text-3xl font-black">
                    {student.fullname?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-indigo-600 text-white p-2.5 rounded-2xl border-4 border-slate-900 shadow-xl group-hover:scale-110 transition-transform">
                  <User size={18} />
                </div>
              </div>

              <div className="mt-6 text-center space-y-1">
                <h3 className="text-2xl font-black text-white tracking-tighter uppercase">
                  {student.fullname}
                </h3>
                <p className="text-sm font-medium text-slate-500">
                  {student.role || "Học viên"}
                </p>
              </div>

              <div className="w-full h-px bg-slate-800 my-8" />

              <div className="w-full space-y-5">
                <div className="flex items-center gap-4 group/item">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 group-hover/item:text-indigo-400 transition-colors">
                    <Mail size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      Email Address
                    </p>
                    <p className="text-sm font-bold text-slate-300 truncate">
                      {student.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group/item">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 group-hover/item:text-indigo-400 transition-colors">
                    <Phone size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      Phone Number
                    </p>
                    <p className="text-sm font-bold text-slate-300">
                      {student.phone || "N/A"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group/item">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 group-hover/item:text-indigo-400 transition-colors">
                    <MapPin size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      Address
                    </p>
                    <p className="text-sm font-bold text-slate-300 truncate">
                      {student.address || "Chưa cập nhật"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group/item">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 group-hover/item:text-indigo-400 transition-colors">
                    <Calendar size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      Join Date
                    </p>
                    <p className="text-sm font-bold text-slate-300">
                      {formatDate(student.createdAt)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 group/item">
                  <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 group-hover/item:text-indigo-400 transition-colors">
                    <Target size={16} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest">
                      Birthday / Gender
                    </p>
                    <p className="text-sm font-bold text-slate-300">
                      {student.dob
                        ? new Date(student.dob).toLocaleDateString("vi-VN")
                        : "N/A"}{" "}
                      • {student.gender || "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Enrolled Courses */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-indigo-600/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

            <div className="p-8 border-b border-slate-800 relative z-10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600/10 rounded-xl text-indigo-400">
                  <BookOpen size={18} />
                </div>
                <h4 className="text-lg font-black text-white uppercase tracking-tighter">
                  Lộ trình học tập
                </h4>
              </div>
              <Badge className="bg-slate-950 border-slate-800 text-[10px] font-black uppercase tracking-widest text-slate-500 px-3 py-1">
                {student.enrollments?.length || 0} KHÓA HỌC
              </Badge>
            </div>

            <div className="p-2 overflow-x-auto relative z-10">
              {!student.enrollments || student.enrollments.length === 0 ? (
                <div className="py-20 text-center space-y-4">
                  <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] w-fit mx-auto opacity-30">
                    <BookOpen size={48} strokeWidth={1} />
                  </div>
                  <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                    Học viên chưa đăng ký khóa học nào
                  </p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-800/50 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 px-6">
                        Khóa học
                      </TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">
                        Tiến độ
                      </TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">
                        Giá mua
                      </TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 text-right px-6">
                        Trạng thái
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {student.enrollments.map((enr: any, idx: number) => (
                      <TableRow
                        key={enr.id}
                        className="border-b border-slate-800/30 hover:bg-slate-800/20 transition-colors group"
                      >
                        <TableCell className="py-5 px-6">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-10 rounded-lg bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                              <img
                                src={enr.course.thumbnail}
                                alt={enr.course.title}
                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                              />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-black text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1 uppercase tracking-tight">
                                {enr.course.title}
                              </p>
                              <p className="text-[9px] font-bold text-slate-600 truncate mt-0.5">
                                Giảng viên: {enr.course.instructor?.fullname}
                              </p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 min-w-[150px]">
                          <div className="space-y-1.5">
                            <div className="flex justify-between text-[8px] font-black tracking-widest uppercase">
                              <span
                                className={
                                  enr.progress === 100
                                    ? "text-emerald-400"
                                    : "text-indigo-400"
                                }
                              >
                                {enr.progress}% COMPLETE
                              </span>
                            </div>
                            <Progress
                              value={enr.progress}
                              className="h-1 bg-slate-950 transition-all"
                            />
                          </div>
                        </TableCell>
                        <TableCell className="py-5">
                          <div className="flex flex-col">
                            <span className="text-[11px] font-black text-slate-300">
                              {enr.course.type === "FREE"
                                ? "MIỄN PHÍ"
                                : formatCurrency(enr.course.price)}
                            </span>
                            <span className="text-[8px] font-bold text-slate-600 uppercase tracking-widest">
                              {formatDate(enr.enrolledAt)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="py-5 text-right px-6">
                          {enr.progress === 100 ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                              Finished
                            </Badge>
                          ) : enr.progress > 0 ? (
                            <Badge className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                              Learning
                            </Badge>
                          ) : (
                            <Badge className="bg-slate-800 text-slate-500 border border-slate-700 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest">
                              Not Started
                            </Badge>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>

            {/* Bottom Note */}
            <div className="p-8 bg-slate-950/30 border-t border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                <Clock size={12} className="text-indigo-400" />
                Cập nhật tiến độ lần cuối: {formatDate(student.updatedAt)}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentDetailPage;
