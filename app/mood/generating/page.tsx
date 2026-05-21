"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t1 = setTimeout(() => setProgress(40), 400);
    const t2 = setTimeout(() => setProgress(80), 1400);
    const t3 = setTimeout(() => setProgress(100), 2400);
    const t4 = setTimeout(() => router.replace("/mood/results"), 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      {/* Top gradient */}
      <div className="reph-gradient px-6 pt-14 pb-16">
        <h1 className="text-[38px] font-bold text-gray-900 leading-tight">
          Generating
          <br />
          Results
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#f2f2f2] px-5 py-5 flex flex-col gap-4">
        {/* Loading card */}
        <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
          </div>

          <p className="text-gray-700 font-semibold text-sm text-center leading-relaxed">
            Analyzing photo, lighting,
            <br />
            and mood intent...
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-[800ms] ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
