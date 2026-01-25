import axiosClient from "@/lib/axiosClient";

export type RegisterPayload = {
  fullname: string;
  email: string;
  password1: string;
  password2: string;
};

export const RegisterApi = async (payload: RegisterPayload) => {
  try {
    if (payload.password1 !== payload.password2) {
      throw new Error("Mật khẩu không khớp");
    }

    const response = await axiosClient.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export type LoginPayload = {
  email: string;
  password: string;
};

export const LoginApi = async (payload: LoginPayload) => {
  try {
    const response = await axiosClient.post("/auth/login", payload,
      // cast to any to allow custom config property `skipAuthRefresh`
      { skipAuthRefresh: true } as any
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const LoginWithGoogle = async (googleToken: string) => {
  try {
    const response = await axiosClient.post("/auth/login-google", {
      googleToken,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const LogoutApi = async () => {
  try {
    await axiosClient.post("/auth/logout");
  } catch (error) {
    throw error;
  }
};

export const SendEmailActiveApi = async () => {
  try {
    await axiosClient.post("/auth/send-email-active");
  } catch (error) {
    throw error;
  }
};

export const ActiveAccountApi = async (otp: string) => {
  try {
    const response = await axiosClient.post("/auth/active-account", { otp });
    return response.data;
  } catch (error) {
    throw error;
  }
};
