"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

const BASE_PHOTO = "https://picsum.photos/seed/reph2/400/250";

const OPTIONS = [
  {
    id: "A",
    label: "Option A",
    filter: "brightness(1.05) contrast(1.15) saturate(0.85)",
  },
  {
    id: "B",
    label: "Option B",
    filter: "brightness(0.98) saturate(1.3) sepia(0.15)",
  },
  {
    id: "C",
    label: "Option C",
    filter: "brightness(0.92) contrast(1.2) saturate(0.75)",
  },
];

export default function ResultsPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("A");

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="results" />

      <div className="px-4 flex flex-col gap-3 pb-6">
        {/* Original */}
        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-2 px-1">
            ORIGINAL
          </p>
          <div className="relative rounded-2xl overflow-hidden">
            <img
              src={BASE_PHOTO}
              alt="original"
              className="w-full h-44 object-cover"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <span className="bg-white/80 rounded-full px-4 py-1 text-xs font-semibold text-gray-700 whitespace-nowrap">
                Original photo
              </span>
            </div>
          </div>
        </div>

        {/* Edited options */}
        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-2 px-1">
            EDITED OPTIONS
          </p>
          <div className="flex flex-col gap-3">
            {OPTIONS.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setSelected(opt.id)}
                className="relative rounded-2xl overflow-hidden w-full text-left"
              >
                <img
                  src={BASE_PHOTO}
                  alt={opt.label}
                  className="w-full h-44 object-cover"
                  style={{ filter: opt.filter }}
                />
                {/* Selected ring overlay */}
                {selected === opt.id && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500 pointer-events-none" />
                )}
                {/* Checkmark badge */}
                {selected === opt.id && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                )}
                {/* Option label */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white/80 rounded-full px-4 py-1 text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {opt.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => router.push("/mood/adjustment")}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
          style={{ background: "#f2c8d4" }}
        >
          Adjust / Fine-tune
        </button>
      </div>
    </div>
  );
}
