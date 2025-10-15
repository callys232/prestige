import { Suspense } from "react";
import SignUp from "../../components/Signup";

export default function SignUpPage() {
  return (
    <div className="bg-white dark:bg-gray-900 min-h-screen">
      <Suspense
        fallback={<div className="p-8 text-center">Loading signup form...</div>}
      >
        <SignUp />
      </Suspense>
    </div>
  );
}
