"use client";

import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, Check, ChevronDown, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useEffect, useState } from "react";
import { fetchAllSpecializations } from "@/store/specializationSlice";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
import {
  applyInstructorApi,
  ApplyInstructorPayload,
} from "@/api/instructor.api";
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
      router.push("/instructor/status");

      toast.success("Đơn đăng ký đã được gửi thành công!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Có lỗi đã xảy ra" );
    }
  };

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
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lĩnh vực chuyên môn
          </label>

          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className="w-full justify-between"
                disabled={loading}
              >
                {selectedSpecs.length > 0
                  ? "Chỉnh sửa lĩnh vực đã chọn"
                  : "Chọn lĩnh vực chuyên môn"}
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandList>
                  {loading ? (
                    <p className="text-center text-gray-500 p-2">Đang tải...</p>
                  ) : (
                    specializations.map((spec) => (
                      <CommandItem
                        key={spec.id}
                        onSelect={() => toggleSelect(spec.id)}
                        className="flex items-center justify-between"
                      >
                        <span>{spec.name}</span>
                        {selectedSpecs.includes(spec.id) && (
                          <Check className="h-4 w-4 text-green-500" />
                        )}
                      </CommandItem>
                    ))
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {/* 🏷 Hiển thị danh sách lĩnh vực đã chọn */}
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
