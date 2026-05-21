"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import { Suspense } from "react";

const SAVED_MOODS = [
  { name: "Soft evening",   info: "4 photos · used 3x" },
  { name: "Fresh morning",  info: "6 photos · used 5x" },
  { name: "Soft cinematic", info: "2 photos · used 1x" },
];

const SETTINGS = [
  { name: "Connected apps",  info: "Instagram · Pinterest" },
  { name: "Style evolution", info: "Personal learning is ON" },
];

function LibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isFromInput = searchParams.get("from") === "mood-input";

  const handleMoodSelect = (moodName: string) => {
    if (isFromInput) {
      router.push("/mood/input?mood=" + encodeURIComponent(moodName));
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="library & settings" />

      <div className="px-4 flex flex-col gap-5">
        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-3 px-1">
            SAVED MOODS
          </p>

          <div className="flex flex-col gap-2">
            {SAVED_MOODS.map((mood) => (
              <button
                key={mood.name}
                onClick={() => handleMoodSelect(mood.name)}
                disabled={!isFromInput}
                className={"bg-white rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm w-full text-left transition-all duration-150" + (isFromInput ? " active:scale-[0.98] active:bg-gray-50" : "")}
              >
                <div className="w-12 h-12 rounded-2xl flex-shrink-0" style={{ background: "#f5ee9a" }} />
                <div className="flex-1">
                  <p className="text-gray-900 font-semibold text-sm">{mood.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{mood.info}</p>
                </div>
                {isFromInput && (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300">
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-3 px-1">
            ACCOUNT & SETTINGS
          </p>
          <div className="flex flex-col gap-2">
            {SETTINGS.map((item) => (
              <div key={item.name} className="bg-white rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl flex-shrink-0" style={{ background: "#f5ee9a" }} />
                <div>
                  <p className="text-gray-900 font-semibold text-sm">{item.name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryContent />
    </Suspense>
  );
}
