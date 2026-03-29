"use client";

import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { LoginWithGoogle } from "@/store/api/common/auth.api";
import { fetchUser } from "@/store/slice/common/userSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";

const GoogleLoginForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Gửi token về backend để verify và lấy JWT riêng
        const response = await LoginWithGoogle(tokenResponse.access_token);

        localStorage.setItem("access_token", response.data.access_token);
        dispatch(fetchUser());

        // Điều hướng theo role
        if (response.data.user.role === "ADMIN") {
          router.push("/admin/dashboard");
        } else if (response.data.user.role === "HOST") {
          router.push("/host/dashboard");
        } else {
          router.push("/");
        }

        toast.success("Đăng nhập thành công");
      } catch (error: any) {
        toast.error(error.response?.data?.message || "Something went wrong!!!");
      }
    },
    onError: () => {
      toast.error("Login Failed");
    },
  });

  return (
    <button
      onClick={() => login()}
      className="w-full flex items-center justify-center gap-3 bg-white border border-slate-100 rounded-2xl py-4 font-black text-slate-900 text-xs uppercase tracking-widest shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-slate-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <FcGoogle className="text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300" />
      <span className="relative z-10">Tiếp tục với Google</span>
    </button>
  );
};

export default GoogleLoginForm;
