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