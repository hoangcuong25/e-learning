"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, Check, ChevronDown, X, AlertTriangle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { fetchAllSpecializations } from "@/store/slice/common/specializationSlice";
import {
  applyInstructorApi,
  ApplyInstructorPayload,
} from "@/store/api/instructor/instructor.api";
import { toast } from "sonner";

const InstructorApplyPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { specializations, loading } = useSelector(
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

  // 🔹 Multi-select state
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
      <div className="max-w-2xl mx-auto py-16 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-yellow-50 border border-yellow-200 rounded-2xl p-8 text-center"
        >
          <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Tài khoản chưa được xác thực
          </h2>
          <p className="text-gray-600 mb-6">
            Vui lòng xác thực tài khoản của bạn để có thể đăng ký trở thành
            giảng viên.
          </p>
          <button
            onClick={() => router.push("/profile")}
            className="bg-yellow-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-yellow-700 transition"
          >
            Đến trang cá nhân
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto py-16 px-6">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl font-bold text-indigo-700 text-center mb-8"
      >
        Đăng ký trở thành giảng viên
      </motion.h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 space-y-6"
      >
        {/* 🧩 Multi-select Specialization */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">
            Lĩnh vực chuyên môn
          </label>

          <button
            type="button"
            onClick={() => setOpen(!open)}
            className="w-full flex justify-between items-center h-11 px-3 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          >
            {selectedSpecs.length > 0
              ? `${selectedSpecs.length} lĩnh vực đã chọn`
              : "Chọn lĩnh vực chuyên môn"}
            <ChevronDown className="w-4 h-4 opacity-60" />
          </button>

          {open && (
            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-56 overflow-y-auto">
              {loading ? (
                <p className="text-sm text-gray-500 p-3 text-center">
                  Đang tải...
                </p>
              ) : specializations.length === 0 ? (
                <p className="text-sm text-gray-500 p-3 text-center">
                  Không có chuyên ngành
                </p>
              ) : (
                specializations.map((spec) => (
                  <div
                    key={spec.id}
                    onClick={() => toggleSelect(spec.id)}
                    className="flex justify-between items-center px-3 py-2 cursor-pointer hover:bg-gray-100"
                  >
                    <span>{spec.name}</span>
                    {selectedSpecs.includes(spec.id) && (
                      <Check className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {selectedSpecs.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {selectedSpecs.map((id) => {
                const spec = specializations.find((s) => s.id === id);
                return (
                  <span
                    key={id}
                    className="flex items-center bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium"
                  >
                    {spec?.name || "Không xác định"}
                    <button
                      type="button"
                      onClick={() => removeSpec(id)}
                      className="ml-2 hover:text-red-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            </div>
          )}

          {errors.specializationIds && (
            <p className="text-sm text-red-500 mt-1">
              {errors.specializationIds.message}
            </p>
          )}
        </div>

        {/* Experience */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Kinh nghiệm giảng dạy
          </label>
          <textarea
            {...register("experience", {
              required: "Vui lòng mô tả kinh nghiệm của bạn",
            })}
            rows={3}
            placeholder="Bạn đã từng giảng dạy hoặc làm việc trong lĩnh vực nào?"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          />
          {errors.experience && (
            <p className="text-sm text-red-500 mt-1">
              {errors.experience.message}
            </p>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Giới thiệu bản thân
          </label>
          <textarea
            {...register("bio", {
              required: "Vui lòng viết vài dòng giới thiệu",
            })}
            rows={4}
            placeholder="Chia sẻ về đam mê, phong cách giảng dạy và mục tiêu của bạn..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400 outline-none resize-none"
          />
          {errors.bio && (
            <p className="text-sm text-red-500 mt-1">{errors.bio.message}</p>
          )}
        </div>

        {/* Submit */}
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={isSubmitting}
          type="submit"
          className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white font-semibold py-2.5 rounded-lg shadow-md hover:bg-indigo-700 transition disabled:opacity-60"
        >
          {isSubmitting && <Loader2 className="w-5 h-5 animate-spin" />}
          {isSubmitting ? "Đang gửi..." : "Gửi đơn đăng ký"}
        </motion.button>
      </form>
    </div>
  );
};

export default InstructorApplyPage;
