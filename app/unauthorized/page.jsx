"use client";

import { useRouter } from "next/navigation";
import { ShieldX } from "lucide-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 text-slate-900">
      <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <ShieldX className="mx-auto mb-4 text-red-600" size={48} strokeWidth={1.7} />
        <h1 className="text-2xl font-semibold">Unauthorized access</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">
          You do not have permission to access this page.
        </p>
        <button
          type="button"
          onClick={() => router.back()}
          className="mt-6 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
        >
          Go back
        </button>
      </section>
    </main>
  );
}