"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, EyeOff, Lock, User, CheckCircle } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { login, forgotPassword, verifyOtp, resetPassword, clearError } from "@/store/slices/authSlice";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();

const {
  loading,
  error: reduxError,

  forgotPasswordLoading,
  forgotPasswordError,

  otpLoading,
  otpError,

  resetPasswordLoading,
  resetPasswordError,
} = useSelector((state) => state.auth);
  const [form, setForm]         = useState({ email: "", password: "" });
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);

  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

const [forgotStep, setForgotStep] = useState("email");

const [forgotEmail, setForgotEmail] = useState("");
const [otp, setOtp] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");
  

  function handleChange(e) {
  setForm(f => ({
    ...f,
    [e.target.name]: e.target.value,
  }));
}

 async function handleSubmit(e) {
  e.preventDefault();

  const result = await dispatch(
    login({
      email: form.email,
      password: form.password,
    })
  );

  if (login.fulfilled.match(result)) {
    const data = result.payload;

    const roleMap = {
      1: "admin",
      2: "pm",
      3: "employee",
      4: "pm_employee",
      5: "sys_admin",
      6: "management_admin",
    };

    const role = roleMap[data.user_Type] || "employee";

    // Clear any stale role from a previous session before writing the new one
    sessionStorage.removeItem("role");
    sessionStorage.setItem("role", role);
    // Mirror role to localStorage so new tabs can restore it
    localStorage.setItem("role", role);

    if (
      ["employee", "sys_admin"].includes(role)
    ) {
      router.push(
        "/reports/resource-allocation"
      );
    } else {
      router.push("/reports/daily-report");
    }
  }
}

async function handleForgotPassword(e) {
  e.preventDefault();

  const result = await dispatch(
    forgotPassword({
      email: forgotEmail,
    })
  );

  if (forgotPassword.fulfilled.match(result)) {
    setForgotStep("otp");
  }
}

async function handleVerifyOtp(e) {
  e.preventDefault();

  const result = await dispatch(
    verifyOtp({
      email: forgotEmail,
      otp,
    })
  );

  if (verifyOtp.fulfilled.match(result)) {
    setForgotStep("reset");
  }
}

async function handleResetPassword(e) {
  e.preventDefault();

  if (newPassword !== confirmPassword) {
    return;
  }

  const result = await dispatch(
    resetPassword({
      email: forgotEmail,
      newPassword,
      otp,
    })
  );

  if (resetPassword.fulfilled.match(result)) {
    setShowForgotPassword(false);
    setForgotStep("email");
    setForgotEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setShowSuccessModal(true);
  }
}

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #e8eaf6 0%, #dde3f0 30%, #e4e8f5 60%, #d8dff0 100%)" }}
    >
      {/* Wavy ribbon background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="18" result="blur" />
              <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
            </filter>
            <filter id="softblur">
              <feGaussianBlur stdDeviation="12" />
            </filter>
          </defs>

          {/* Wide glowing ribbon 1 - main diagonal sweep */}
          <path d="M-200,600 C100,500 300,200 600,350 S1000,600 1300,300 S1600,100 1700,200"
            fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="90" filter="url(#softblur)" />
          <path d="M-200,600 C100,500 300,200 600,350 S1000,600 1300,300 S1600,100 1700,200"
            fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="40" />

          {/* Wide glowing ribbon 2 - lower sweep */}
          <path d="M-200,750 C200,650 400,400 700,520 S1100,750 1400,500 S1650,300 1800,380"
            fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="70" filter="url(#softblur)" />
          <path d="M-200,750 C200,650 400,400 700,520 S1100,750 1400,500 S1650,300 1800,380"
            fill="none" stroke="rgba(255,255,255,0.18)" strokeWidth="30" />

          {/* Thin crisp highlight on top of ribbon 1 */}
          <path d="M-200,600 C100,500 300,200 600,350 S1000,600 1300,300 S1600,100 1700,200"
            fill="none" stroke="rgba(255,255,255,0.7)" strokeWidth="3" />

          {/* Thin crisp highlight on ribbon 2 */}
          <path d="M-200,750 C200,650 400,400 700,520 S1100,750 1400,500 S1650,300 1800,380"
            fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" />

          {/* Right side lavender glow accent */}
          <ellipse cx="1380" cy="520" rx="180" ry="280" fill="rgba(180,185,230,0.25)" filter="url(#softblur)" />

          {/* Left side warm glow */}
          <ellipse cx="200" cy="420" rx="220" ry="200" fill="rgba(220,225,245,0.3)" filter="url(#softblur)" />
        </svg>
      </div>

      {/* Left branding */}
      <div className="hidden lg:flex flex-col items-start justify-center flex-1 pl-24 z-10 gap-3">
        <Image src="/login.png" alt="Medtrix" width={500} height={400} loading="eager" className="object-contain drop-shadow-[2px_4px_6px_black] h-auto pl-24" />
      </div>

      {/* Login card */}
      <div className="z-10 w-full max-w-[400px] mx-6 lg:mr-24 rounded-3xl p-8 flex flex-col"
        style={{
          background: "rgba(255,255,255,0.45)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.75)",
          boxShadow: "0 8px 32px rgba(100,110,160,0.12), 0 2px 8px rgba(100,110,160,0.08)",
        }}
      >
        {showForgotPassword ? (
  <>
    {/* STEP 1 — Email */}
    {forgotStep === "email" && (
      <div>
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(200,205,225,0.8)",
              boxShadow: "0 2px 12px rgba(100,110,160,0.12)",
            }}
          >
            <Lock size={22} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-center text-[22px] font-bold text-slate-800 mb-1">
          Forgot Password?
        </h1>

        <p className="text-center text-sm text-slate-400 mb-6">
          Enter your email to reset your password
        </p>

        <form onSubmit={handleForgotPassword} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">
              Email
            </label>
            <div
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(200,205,225,0.7)",
              }}
            >
              <User size={15} className="text-slate-400 flex-shrink-0" />
              <input
                type="email"
                placeholder="Enter your email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                required
              />
            </div>
          </div>

          {forgotPasswordError && (
            <p className="text-xs text-red-500 text-center">{forgotPasswordError}</p>
          )}

          <button
            type="submit"
            disabled={forgotPasswordLoading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
            style={{ background: "#303030", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
          >
            {forgotPasswordLoading ? "Sending..." : "Send Reset Link"}
          </button>

          <button
            type="button"
            onClick={() => { setShowForgotPassword(false); setForgotStep("email"); }}
            className="text-sm text-red-500 hover:text-red-600"
          >
            ‹ Back to login
          </button>
        </form>
      </div>
    )}

    {/* STEP 2 — OTP */}
    {forgotStep === "otp" && (
      <div>
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(200,205,225,0.8)",
              boxShadow: "0 2px 12px rgba(100,110,160,0.12)",
            }}
          >
            <Lock size={22} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-center text-[22px] font-bold text-slate-800 mb-1">
          Verify OTP
        </h1>

        <p className="text-center text-sm text-slate-400 mb-6">
          Enter the OTP sent to your email
        </p>

        <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">
              OTP
            </label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-xl px-4 py-3 text-sm text-slate-700 outline-none"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(200,205,225,0.7)",
              }}
              required
            />
          </div>

          {otpError && (
            <p className="text-xs text-red-500 text-center">{otpError}</p>
          )}

          <button
            type="submit"
            disabled={otpLoading}
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
            style={{ background: "#303030", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
          >
            {otpLoading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => { setForgotStep("email"); setOtp(""); }}
            className="text-sm text-red-500 hover:text-red-600"
          >
            ‹ Back
          </button>
        </form>
      </div>
    )}

    {/* STEP 3 — Reset Password */}
    {forgotStep === "reset" && (
      <div>
        <div className="flex justify-center mb-4">
          <div
            className="w-14 h-14 rounded-full flex items-center justify-center"
            style={{
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(200,205,225,0.8)",
              boxShadow: "0 2px 12px rgba(100,110,160,0.12)",
            }}
          >
            <Lock size={22} className="text-red-500" />
          </div>
        </div>

        <h1 className="text-center text-[22px] font-bold text-slate-800 mb-1">
          Reset Password
        </h1>

        <p className="text-center text-sm text-slate-400 mb-6">
          Create a new password for your account
        </p>

        <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">
              New Password
            </label>
            <div
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(200,205,225,0.7)",
              }}
            >
              <Lock size={15} className="text-slate-400 flex-shrink-0" />
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">
              Confirm Password
            </label>
            <div
              className="flex items-center gap-2.5 rounded-xl px-3.5 py-3"
              style={{
                background: "rgba(255,255,255,0.6)",
                border: "1px solid rgba(200,205,225,0.7)",
              }}
            >
              <Lock size={15} className="text-slate-400 flex-shrink-0" />
              <input
                type="password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
                required
              />
            </div>
          </div>

          {newPassword && confirmPassword && newPassword !== confirmPassword && (
            <p className="text-xs text-red-500 text-center">Passwords do not match.</p>
          )}

          {resetPasswordError && (
            <p className="text-xs text-red-500 text-center">{resetPasswordError}</p>
          )}

          <button
            type="submit"
            disabled={
              resetPasswordLoading ||
              !newPassword ||
              !confirmPassword ||
              newPassword !== confirmPassword
            }
            className="w-full py-3.5 rounded-xl text-white font-semibold text-sm disabled:opacity-60"
            style={{ background: "#303030", boxShadow: "0 4px 12px rgba(0,0,0,0.2)" }}
          >
            {resetPasswordLoading ? "Resetting..." : "Reset Password"}
          </button>

          <button
            type="button"
            onClick={() => setForgotStep("otp")}
            className="text-sm text-red-500 hover:text-red-600"
          >
            ‹ Back
          </button>
        </form>
      </div>
    )}
  </>
) : (
  <>
    {/* Lock icon */}
    <div className="flex justify-center mb-4">
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{
          background: "rgba(255,255,255,0.7)",
          border: "1px solid rgba(200,205,225,0.8)",
          boxShadow:
            "0 2px 12px rgba(100,110,160,0.12)",
        }}
      >
        <Lock size={22} className="text-red-500" />
      </div>
    </div>

    <h1 className="text-center text-[22px] font-bold text-slate-800 mb-1">
      Project Management Portal
    </h1>

    <p className="text-center text-sm text-slate-400 mb-6">
      Welcome back! Please sign in to continue
    </p>

    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4"
    >

      {/* Email */}
      <div>
        <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-1.5 block">
          Email
        </label>

        <div
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-3"
          style={{
            background: "rgba(255,255,255,0.6)",
            border:
              "1px solid rgba(200,205,225,0.7)",
          }}
        >
          <User
            size={15}
            className="text-slate-400 flex-shrink-0"
          />

          <input
            name="email"
            type="text"
            placeholder="Enter your email or username"
            value={form.email}
            onChange={handleChange}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            required
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <div className="flex justify-between items-center mb-1.5">

          <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest">
            Password
          </label>

          <button
            type="button"
            onClick={() => {
              setShowForgotPassword(true);
              setForgotStep("email");
              setForgotEmail(form.email);
            }}
            className="text-xs text-red-500 hover:text-red-600 font-medium transition-colors"
          >
            Forgot Password?
          </button>

        </div>

        <div
          className="flex items-center gap-2.5 rounded-xl px-3.5 py-3"
          style={{
            background: "rgba(255,255,255,0.6)",
            border:
              "1px solid rgba(200,205,225,0.7)",
          }}
        >
          <Lock
            size={15}
            className="text-slate-400 flex-shrink-0"
          />

          <input
            name="password"
            type={showPw ? "text" : "password"}
            placeholder="••••••••••"
            value={form.password}
            onChange={handleChange}
            className="flex-1 bg-transparent text-sm text-slate-700 placeholder-slate-400 outline-none"
            required
          />

          <button
            type="button"
            onClick={() =>
              setShowPw((v) => !v)
            }
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPw ? (
              <EyeOff size={15} />
            ) : (
              <Eye size={15} />
            )}
          </button>

        </div>
      </div>

      {/* Remember me */}
      <label className="flex items-center gap-2.5 cursor-pointer select-none">

        <input
          type="checkbox"
          checked={remember}
          onChange={(e) =>
            setRemember(e.target.checked)
          }
          className="w-4 h-4 rounded border-slate-300 accent-red-500 cursor-pointer"
        />

        <span className="text-sm text-slate-500">
          Remember Me
        </span>

      </label>

      {/* Login error */}
      {reduxError && (
        <p className="text-xs text-red-500 text-center -mt-1">
          {reduxError}
        </p>
      )}

      {/* Sign in */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-sm tracking-wide transition-all disabled:opacity-60"
        style={{
          background:
            "linear-gradient(90deg, #e53935 0%, #c2185b 100%)",
          boxShadow:
            "0 4px 20px rgba(220,50,80,0.35)",
        }}
      >
        {loading
          ? "Signing in…"
          : "Sign in"}
      </button>

    </form>
  </>
)}
      </div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center gap-4 bg-white"
            style={{ boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}
          >
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-green-50">
              <CheckCircle size={34} className="text-green-500" />
            </div>

            <div className="text-center">
              <h2 className="text-lg font-bold text-slate-800">
                Password Updated!
              </h2>
              <p className="mt-1.5 text-sm text-slate-500">
                Your password has been reset successfully. Please log in with your new password.
              </p>
            </div>

            <button
              onClick={() => {
                setShowSuccessModal(false);
              }}
              className="w-full py-3 rounded-xl text-white text-sm font-semibold transition-all"
              style={{
                background: "linear-gradient(90deg, #e53935 0%, #c2185b 100%)",
                boxShadow: "0 4px 16px rgba(220,50,80,0.35)",
              }}
            >
              Back to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
