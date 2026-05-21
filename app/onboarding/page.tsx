"use client";

import { useRouter } from "next/navigation";

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

export default function OnboardingPage() {
  const router = useRouter();

  return (
    <div className="min-h-full flex flex-col">
      <div className="reph-gradient relative px-6 pt-14 pb-20">
        <button
          onClick={() => router.push("/home")}
          className="absolute top-12 left-6 w-10 h-10 rounded-full bg-white/70 shadow-sm flex items-center justify-center text-gray-600"
        >
          <HomeIcon />
        </button>
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

        <div className="flex gap-3 mt-auto pt-4">
          <button
            onClick={() => router.push("/home")}
            className="flex-1 py-4 rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm"
          >
            Skip
          </button>
          <button
            onClick={() => router.push("/home")}
            className="flex-1 py-4 rounded-full text-gray-800 font-semibold text-sm"
            style={{ background: "#f2c8d4" }}
          >
            Go to main
          </button>
        </div>
      </div>
    </div>
  );
}
