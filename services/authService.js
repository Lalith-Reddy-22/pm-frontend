import axiosClient from "./axiosClient";

export async function loginUser(email, password) {
  const response = await axiosClient.post("/auth/login", {
    emailId: email,
    password: password,
  });

  const data = response.data;

  const token =
    data?.accessToken ||
    data?.token ||
    data?.data?.accessToken ||
    data?.data?.token ||
    data?.jwt ||
    data?.data?.jwt;

  if (typeof window !== "undefined" && token) {
    sessionStorage.setItem("accessToken", token);
  }

  return data;
}

export async function forgotPasswordRequest(email) {
  const response = await axiosClient.post("/auth/forgot-password", { email });
  return response.data;
}

export async function verifyOtpRequest({ email, otp }) {
  const response = await axiosClient.post("/auth/verify-otp", { email, otp });
  return response.data;
}

export async function resetPasswordRequest({ email, newPassword, otp }) {
  const response = await axiosClient.post("/auth/reset-password", {
    email,
    newPassword,
    otp,
  });
  return response.data;
}
