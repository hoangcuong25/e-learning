"use client";

import { FcGoogle } from "react-icons/fc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import { LoginWithGoogle } from "@/api/auth.api";
import { fetchUser } from "@/store/user/userSlice";

const GoogleLoginForm = () => {
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Gửi token về backend để verify và lấy JWT riêng
        const response = await LoginWithGoogle(tokenResponse.access_token);

        localStorage.setItem("access_token", response.data.access_token);
        fetchUser();

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
      className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-2 font-semibold text-gray-700
                 shadow-md hover:shadow-lg transition hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 cursor-pointer"
    >
      <FcGoogle className="text-2xl" />
      <span>Đăng nhập với Google</span>
    </button>
  );
};

export default GoogleLoginForm;
