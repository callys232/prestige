"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

export default function VerifyAccount() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";

  const [otp, setOtp] = useState("");
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });
    setLoading(true);

    try {
      const res = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Verification failed");

      setStatus({
        type: "success",
        message: "✅ Account verified successfully!",
      });
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const resendCode = async () => {
    try {
      const res = await fetch("/api/auth/resend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (res.ok) {
        setStatus({
          type: "success",
          message: "Verification code resent successfully!",
        });
      } else {
        setStatus({
          type: "error",
          message: json.message || "Failed to resend code",
        });
      }
    } catch {
      setStatus({ type: "error", message: "Network error. Please try again." });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center text-blue-700 mb-4">
          Verify Your Account
        </h2>

        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          We sent a 6-digit verification code to:
          <br />
          <b>{email}</b>
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-3 py-2 border rounded-md text-center text-lg tracking-widest focus:ring-2 focus:ring-blue-500"
          />

          {status.message && (
            <p
              className={`text-sm ${
                status.type === "error" ? "text-red-500" : "text-green-600"
              } text-center`}
            >
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 text-white py-2 rounded-md font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify Account"}
          </button>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={resendCode}
            className="text-sm text-blue-600 hover:underline"
          >
            Didn’t get a code? Resend
          </button>
        </div>
      </motion.div>
    </div>
  );
}
