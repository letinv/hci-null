"use client";

import { useRouter } from "next/navigation";

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-full flex flex-col">
      <div className="reph-gradient relative px-6 pt-14 pb-20">
        <div className="absolute top-12 right-6 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center">
          <span className="text-sm font-semibold text-indigo-400">N</span>
        </div>
        <h1 className="text-[38px] font-bold text-gray-900 leading-tight">
          Exploring
          <br />
          Moods
        </h1>
      </div>

      <div className="flex-1 bg-[#f2f2f2] px-6 pt-6 pb-10 flex flex-col gap-5">
        <div className="bg-white rounded-2xl p-6 shadow-sm">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Mood-based editing
          </h2>
          <div className="text-gray-500 text-sm leading-7">
            <p>Translate words like "warm", "soft", or</p>
            <p>"dreamy" into edits.</p>
            <p>Build consistency across multiple photos.</p>
            <p>Save moods and reuse them later.</p>
          </div>
        </div>

        <div className="mt-auto pt-4">
          <button
            onClick={() => router.push("/home")}
            className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
            style={{ background: "#f2c8d4" }}
          >
            Go to main
          </button>
        </div>
      </div>
    </div>
  );
}
