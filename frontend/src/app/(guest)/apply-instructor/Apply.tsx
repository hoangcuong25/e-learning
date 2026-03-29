"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, Check, ChevronDown, X, AlertTriangle, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { fetchAllSpecializations } from "@/store/slice/common/specializationSlice";
import {
  applyInstructorApi,
  ApplyInstructorPayload,
} from "@/store/api/instructor/instructor.api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const InstructorApplyPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { specializations, loading: specsLoading } = useSelector(
    (state: RootState) => state.specialization
  );
  const { user } = useSelector((state: RootState) => state.user);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ApplyInstructorPayload>();

  const [open, setOpen] = useState(false);
  const [selectedSpecs, setSelectedSpecs] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchAllSpecializations());
  }, [dispatch]);

  const toggleSelect = (id: number) => {
    const updated = selectedSpecs.includes(id)
      ? selectedSpecs.filter((item) => item !== id)
      : [...selectedSpecs, id];
    setSelectedSpecs(updated);
    setValue("specializationIds", updated);
  };

  const removeSpec = (id: number) => {
    const updated = selectedSpecs.filter((item) => item !== id);
    setSelectedSpecs(updated);
    setValue("specializationIds", updated);
  };

  const onSubmit = async (data: ApplyInstructorPayload) => {
    try {
      if (!user) {
        toast.error("Bạn cần đăng nhập để gửi đơn đăng ký.");
        return;
      }
      await applyInstructorApi(user.id, data);
      router.push("/status-instructor");
      toast.success("Đơn đăng ký đã được gửi thành công!");
    } catch (err: any) {
      const message =
        err?.response?.data?.message ||
        "Đã xảy ra lỗi trong quá trình gửi đơn. Vui lòng thử lại sau.";
      toast.error(message);
    }
  };

  if (user && !user.isVerified) {
    return (
      <div className="min-h-screen items-center justify-center flex px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-white border border-slate-100 rounded-[3rem] p-12 text-center shadow-2xl shadow-indigo-500/5 space-y-8"
        >
          <div className="mx-auto w-24 h-24 bg-amber-50 text-amber-500 rounded-[2.5rem] flex items-center justify-center mb-4">
            <AlertTriangle size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">
              Xác thực tài khoản
            </h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Vui lòng xác thực tài khoản của bạn để có thể tham gia vào đội ngũ giảng viên chuyên nghiệp của EduSmart.
            </p>
          </div>
          <Button
            size="lg"
            onClick={() => router.push("/profile")}
            className="w-full h-16 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-2xl transition-all uppercase tracking-widest text-[11px]"
          >
            Đến trang cá nhân ngay
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 px-6">
      <div className="max-w-3xl mx-auto space-y-12">
        <div className="text-center space-y-4 pt-12">
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600"
           >
             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Application Form</span>
           </motion.div>
           <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
              Trở thành giảng viên
           </h1>
           <p className="text-slate-400 font-medium max-w-md mx-auto">
             Hãy điền đầy đủ thông tin bên dưới để chúng tôi có thể hiểu rõ hơn về năng lực chuyên môn của bạn.
           </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-[3.5rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.05)] p-10 md:p-16 border border-slate-50 space-y-10"
        >
          {/* 🧩 Multi-select Specialization */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
              Lĩnh vực chuyên môn
            </label>

            <div className="relative">
              <button
                type="button"
                onClick={() => setOpen(!open)}
                className="w-full h-16 px-6 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-all font-bold text-slate-700"
              >
                <span className={selectedSpecs.length > 0 ? "text-slate-900" : "text-slate-400"}>
                  {selectedSpecs.length > 0
                    ? `${selectedSpecs.length} lĩnh vực đã chọn`
                    : "Lựa chọn chuyên môn của bạn"}
                </span>
                <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${open ? 'rotate-180' : ''} text-slate-400`} />
              </button>

              {open && (
                <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   className="absolute z-50 mt-4 w-full bg-white border border-slate-100 rounded-[2rem] shadow-2xl p-4 max-h-72 overflow-y-auto"
                >
                  {specsLoading ? (
                    <div className="p-8 text-center">
                       <Loader2 className="w-6 h-6 animate-spin mx-auto text-indigo-600" />
                    </div>
                  ) : specializations.map((spec) => (
                    <div
                      key={spec.id}
                      onClick={() => toggleSelect(spec.id)}
                      className="flex justify-between items-center px-6 py-4 cursor-pointer hover:bg-slate-50 rounded-xl transition-colors group"
                    >
                      <span className="font-bold text-slate-700 group-hover:text-slate-900">{spec.name}</span>
                      {selectedSpecs.includes(spec.id) && (
                        <Check className="w-5 h-5 text-indigo-600" />
                      )}
                    </div>
                  ))}
                </motion.div>
              )}
            </div>

            {selectedSpecs.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {selectedSpecs.map((id) => {
                  const spec = specializations.find((s) => s.id === id);
                  return (
                    <motion.span
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={id}
                      className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-widest"
                    >
                      {spec?.name}
                      <button
                        type="button"
                        onClick={() => removeSpec(id)}
                        className="hover:text-red-500 transition-colors"
                      >
                        <X size={14} />
                      </button>
                    </motion.span>
                  );
                })}
              </div>
            )}
            {errors.specializationIds && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-2">
                {errors.specializationIds.message}
              </p>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
              Kinh nghiệm giảng dạy
            </label>
            <textarea
              {...register("experience", {
                required: "Vui lòng mô tả kinh nghiệm của bạn",
              })}
              rows={4}
              placeholder="Mô tả ngắn gọn về quá trình công tác hoặc giảng dạy của bạn..."
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none resize-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
            />
            {errors.experience && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-2">
                {errors.experience.message}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-4">
            <label className="text-xs font-black text-slate-900 uppercase tracking-[0.2em] flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-indigo-600 rounded-full" />
              Giới thiệu bản thân
            </label>
            <textarea
              {...register("bio", {
                required: "Vui lòng viết vài dòng giới thiệu",
              })}
              rows={5}
              placeholder="Chia sẻ về phong cách giảng dạy và giá trị cốt lõi của bạn..."
              className="w-full px-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none resize-none transition-all font-medium text-slate-900 placeholder:text-slate-400"
            />
            {errors.bio && (
              <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest pl-2">
                {errors.bio.message}
              </p>
            )}
          </div>

          {/* Submit */}
          <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            type="submit"
            className="w-full h-20 py-6 flex justify-center items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-[2rem] shadow-2xl shadow-indigo-600/20 transition-all uppercase tracking-[0.2em] text-[11px] disabled:opacity-50"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <CheckCircle size={18} />
            )}
            {isSubmitting ? "Đang xử lý hồ sơ..." : "Gửi hồ sơ đăng ký"}
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default InstructorApplyPage;
