"use client";

import { useRouter } from "next/navigation";

export default function SplashPage() {
  const router = useRouter();

  return (
    <div
      className="reph-gradient min-h-full flex flex-col items-center justify-between px-8 py-16"
    >
      {/* Center: logo + title */}
      <div className="flex-1 flex flex-col items-center justify-center gap-7">
        {/* App icon */}
        <div className="w-40 h-40 bg-white rounded-[36px] shadow-2xl flex items-center justify-center">
          <span className="text-[48px] font-bold text-gray-900 tracking-tight">
            RE :
          </span>
        </div>

        {/* Title + subtitle */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">RePh</h1>
          <p className="text-gray-500 text-sm leading-relaxed">
            Edit your photos by mood, not by
            <br />
            parameters.
          </p>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => router.push("/onboarding")}
        className="w-full py-4 rounded-full text-gray-800 font-medium text-base"
        style={{ background: "rgba(242, 200, 212, 0.8)" }}
      >
        Tap to begin
      </button>
    </div>
  );
}
