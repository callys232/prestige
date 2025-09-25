"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function PaystackSuccess() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("Verifying payment...");
  const [success, setSuccess] = useState<boolean | null>(null);

  const reference = searchParams.get("reference");

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setMessage("No payment reference provided.");
        setSuccess(false);
        return;
      }

      try {
        const res = await fetch(`/api/payment/paystack/callback?reference=${reference}`);
        const data = await res.json();

        if (res.ok && data.status === "success") {
          setMessage("Payment successful!");
          setSuccess(true);
        } else {
          setMessage(data.message || "Payment verification failed.");
          setSuccess(false);
        }
      } catch (err) {
        console.error(err);
        setMessage("An error occurred while verifying payment.");
        setSuccess(false);
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <>
      <p className={`mb-6 ${success ? "text-green-600" : "text-red-600"}`}>
        {message}
      </p>

      <Link href="/">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Go Home
        </button>
      </Link>
    </>
  );
}
