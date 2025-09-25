import { Suspense } from "react";
import PaystackSuccess from "./PaystackSuccess";

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-2xl font-bold mb-4">Paystack Payment</h1>

        {/* Wrap client component in Suspense */}
        <Suspense fallback={<p className="text-gray-600">Loading...</p>}>
          <PaystackSuccess />
        </Suspense>
      </div>
    </div>
  );
}
