import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "@/services/axiosClient";

/* =========================================================
   LOGIN
========================================================= */

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", {
        emailId: email,
        password: password,
      });

      return response.data;
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error.response?.data ?? error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Invalid email or password."
      );
    }
  }
);

/* =========================================================
   FORGOT PASSWORD
========================================================= */

export const forgotPassword = createAsyncThunk(
  "auth/forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/auth/forgot-password",
        {
          email,
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "FORGOT PASSWORD ERROR:",
        error.response?.data ?? error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to send reset link."
      );
    }
  }
);

/* =========================================================
   VERIFY OTP
========================================================= */

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post(
        "/auth/verify-otp",
        {
          email,
          otp,
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "VERIFY OTP ERROR:",
        error.response?.data ?? error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Invalid OTP."
      );
    }
  }
);

/* =========================================================
   RESET PASSWORD
========================================================= */

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (
    { email, newPassword, otp },
    { rejectWithValue }
  ) => {
    try {
      const response = await axiosClient.post(
        "/auth/reset-password",
        {
          email,
          newPassword,
          otp,
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "RESET PASSWORD ERROR:",
        error.response?.data ?? error.message
      );

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Failed to reset password."
      );
    }
  }
);

/* =========================================================
   INITIAL STATE
========================================================= */

const initialState = {
  user: null,

  accessToken: null,
  refreshToken: null,

  loading: false,
  error: null,
  isAuthenticated: false,

  // Forgot password
  forgotPasswordLoading: false,
  forgotPasswordError: null,
  forgotPasswordSuccess: false,

  // OTP
  otpLoading: false,
  otpError: null,
  otpVerified: false,

  // Reset password
  resetPasswordLoading: false,
  resetPasswordError: null,
  resetPasswordSuccess: false,
};

/* =========================================================
   AUTH SLICE
========================================================= */

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;

      state.loading = false;
      state.error = null;
      state.isAuthenticated = false;

      state.forgotPasswordLoading = false;
      state.forgotPasswordError = null;
      state.forgotPasswordSuccess = false;

      state.otpLoading = false;
      state.otpError = null;
      state.otpVerified = false;

      state.resetPasswordLoading = false;
      state.resetPasswordError = null;
      state.resetPasswordSuccess = false;

      if (typeof window !== "undefined") {
        sessionStorage.removeItem("accessToken");
        sessionStorage.removeItem("refreshToken");
        sessionStorage.removeItem("empId");
        sessionStorage.removeItem("userType");
        sessionStorage.removeItem("employeeName");
        sessionStorage.removeItem("email");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("auth");
      }
    },
  },

  extraReducers: (builder) => {
    builder

      /* =====================================================
         LOGIN
      ===================================================== */

      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(login.fulfilled, (state, action) => {
        const data = action.payload;

        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;

        state.accessToken =
          data?.accessToken || null;

        state.refreshToken =
          data?.refreshToken || null;

        state.user = {
          empId: data?.empId,
          userType: data?.user_Type,
          employeeName: data?.employee_Name,
          email: data?.emailId,
        };

        // Save authentication data
        if (typeof window !== "undefined") {
          sessionStorage.setItem(
            "accessToken",
            data?.accessToken || ""
          );

          sessionStorage.setItem(
            "refreshToken",
            data?.refreshToken || ""
          );

          sessionStorage.setItem(
            "empId",
            String(data?.empId || "")
          );

          sessionStorage.setItem(
            "userType",
            String(data?.user_Type || "")
          );

          sessionStorage.setItem(
            "employeeName",
            data?.employee_Name || ""
          );

          sessionStorage.setItem(
            "email",
            data?.emailId || ""
          );

          sessionStorage.setItem(
            "auth",
            "true"
          );
        }
      })

      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      /* =====================================================
         FORGOT PASSWORD
      ===================================================== */

      .addCase(
        forgotPassword.pending,
        (state) => {
          state.forgotPasswordLoading = true;
          state.forgotPasswordError = null;
          state.forgotPasswordSuccess = false;
        }
      )

      .addCase(
        forgotPassword.fulfilled,
        (state) => {
          state.forgotPasswordLoading = false;
          state.forgotPasswordError = null;
          state.forgotPasswordSuccess = true;
        }
      )

      .addCase(
        forgotPassword.rejected,
        (state, action) => {
          state.forgotPasswordLoading = false;
          state.forgotPasswordSuccess = false;
          state.forgotPasswordError =
            action.payload;
        }
      )

      /* =====================================================
         VERIFY OTP
      ===================================================== */

      .addCase(
        verifyOtp.pending,
        (state) => {
          state.otpLoading = true;
          state.otpError = null;
          state.otpVerified = false;
        }
      )

      .addCase(
        verifyOtp.fulfilled,
        (state) => {
          state.otpLoading = false;
          state.otpError = null;
          state.otpVerified = true;
        }
      )

      .addCase(
        verifyOtp.rejected,
        (state, action) => {
          state.otpLoading = false;
          state.otpVerified = false;
          state.otpError = action.payload;
        }
      )

      /* =====================================================
         RESET PASSWORD
      ===================================================== */

      .addCase(
        resetPassword.pending,
        (state) => {
          state.resetPasswordLoading = true;
          state.resetPasswordError = null;
          state.resetPasswordSuccess = false;
        }
      )

      .addCase(
        resetPassword.fulfilled,
        (state) => {
          state.resetPasswordLoading = false;
          state.resetPasswordError = null;
          state.resetPasswordSuccess = true;
        }
      )

      .addCase(
        resetPassword.rejected,
        (state, action) => {
          state.resetPasswordLoading = false;
          state.resetPasswordSuccess = false;
          state.resetPasswordError =
            action.payload;
        }
      );
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;