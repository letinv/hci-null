"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const STAGES = [
  { progress: 0,   text: "Preparing photo..." },
  { progress: 35,  text: "Compressing image..." },
  { progress: 68,  text: "Saving to Camera Roll..." },
  { progress: 100, text: "Saved!" },
];

export default function SavingPage() {
  const router = useRouter();
  const [stage, setStage] = useState(0);

  useEffect(() => {
    const t0 = setTimeout(() => setStage(0), 0);
    const t1 = setTimeout(() => setStage(1), 600);
    const t2 = setTimeout(() => setStage(2), 1400);
    const t3 = setTimeout(() => setStage(3), 2300);
    const t4 = setTimeout(() => router.push("/home"), 4000);
    return () => [t0, t1, t2, t3, t4].forEach(clearTimeout);
  }, [router]);

  const { progress, text } = STAGES[stage];
  const isDone = stage === 3;

  return (
    <div className="min-h-full flex flex-col">
      <div className="reph-gradient px-6 pt-14 pb-16">
        <h1 className="text-[38px] font-bold text-gray-900 leading-tight">
          {isDone ? (
            <>All Done!</>
          ) : (
            <>Saving to<br />Album</>
          )}
        </h1>
      </div>

      <div className="flex-1 bg-[#f2f2f2] px-5 py-6 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-7 flex flex-col items-center gap-5">

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center relative overflow-hidden">
            {isDone ? (
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <circle cx="20" cy="20" r="18" fill="#f2c8d4" />
                <path
                  d="M12 20l6 6 10-10"
                  stroke="#1c1c1e"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <div className="relative flex items-center justify-center w-full h-full">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <rect x="3" y="10" width="30" height="20" rx="3" fill="#e5e5e5" />
                  <rect x="8" y="6"  width="20" height="16" rx="2" fill="#d4d4d4" />
                  <rect x="11" y="9" width="14" height="10" rx="1.5" fill="white" />
                </svg>
                <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-sm bg-[#f2c8d4]"
                  style={{ animation: "fall 1.2s ease-in infinite" }} />
              </div>
            )}
          </div>

          {/* Text */}
          <p className="text-gray-700 font-semibold text-sm text-center">{text}</p>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700 ease-out"
              style={{
                width: `${progress}%`,
                background: isDone ? "#f2c8d4" : "#3b82f6",
              }}
            />
          </div>

          <p className="text-gray-400 text-xs">{progress}%</p>
        </div>

      </div>

      <style>{`
        @keyframes fall {
          0%   { opacity: 1; transform: translateX(-50%) translateY(0px);  }
          80%  { opacity: 1; transform: translateX(-50%) translateY(16px); }
          100% { opacity: 0; transform: translateX(-50%) translateY(16px); }
        }
      `}</style>
    </div>
  );
}
