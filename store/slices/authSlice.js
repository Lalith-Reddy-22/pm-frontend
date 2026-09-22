import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  loginUser,
  forgotPasswordRequest,
  verifyOtpRequest,
  resetPasswordRequest,
} from "@/services/authService";

/* =========================================================
   LOGIN
========================================================= */

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await loginUser(email, password);
      return data;
    } catch (error) {
      console.error(
        "LOGIN ERROR:",
        error.response?.data ?? error.message
      );

      // Always show a friendly message for bad credentials
      if (error.response?.status === 401) {
        return rejectWithValue("Invalid credentials.");
      }

      return rejectWithValue(
        error.response?.data?.message ||
          error.response?.data?.title ||
          error.message ||
          "Invalid credentials."
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
      const data = await forgotPasswordRequest(email);
      return data;
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
      const data = await verifyOtpRequest({ email, otp });
      return data;
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
      const data = await resetPasswordRequest({ email, newPassword, otp });
      return data;
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
    clearError: (state) => {
      state.error = null;
    },
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
        const keys = ["accessToken", "refreshToken", "empId", "userType", "employeeName", "email", "role", "auth"];
        keys.forEach((key) => {
          sessionStorage.removeItem(key);
          localStorage.removeItem(key);
        });
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
        const authData = data?.data ?? data;
        const accessToken =
          authData?.accessToken ||
          authData?.access_token ||
          authData?.token ||
          authData?.jwt ||
          null;
        const refreshToken =
          authData?.refreshToken ||
          authData?.refresh_token ||
          null;

        state.loading = false;
        state.error = null;
        state.isAuthenticated = true;

        state.accessToken = accessToken;

        state.refreshToken = refreshToken;

        state.user = {
          empId: authData?.empId,
          userType: authData?.user_Type,
          employeeName: authData?.employee_Name,
          email: authData?.emailId,
        };

        // Save authentication data
        if (typeof window !== "undefined") {
          const authData_persist = {
            accessToken:  accessToken || "",
            refreshToken: refreshToken || "",
            empId:        String(authData?.empId || ""),
            userType:     String(authData?.user_Type || ""),
            employeeName: authData?.employee_Name || "",
            email:        authData?.emailId || "",
            auth:         "true",
          };

          // Write to sessionStorage (current tab)
          Object.entries(authData_persist).forEach(([key, value]) => {
            sessionStorage.setItem(key, value);
          });

          // Also write to localStorage so new tabs and page refreshes
          // can restore the session without requiring a re-login.
          Object.entries(authData_persist).forEach(([key, value]) => {
            localStorage.setItem(key, value);
          });
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

export const { clearError, logout } = authSlice.actions;

export default authSlice.reducer;