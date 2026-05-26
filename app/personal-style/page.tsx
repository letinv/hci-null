"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

const WHY_CHIPS = ["warm tones", "soft contrast", "cinematic"];
const REFINE_CHIPS = ["slightly warmer", "softer", "less intense"];

export default function PersonalStylePage() {
  const router = useRouter();
  const [selectedRefine, setSelectedRefine] = useState("softer");

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="personal style suggestion" />

      <p className="px-5 pt-1 pb-4 text-gray-500 text-sm leading-relaxed">
        Based on past edits, Reph suggests
        <br />
        a style that matches your taste.
      </p>

      <div className="px-4 flex flex-col gap-4">
        {/* Photo */}
        <div className="rounded-2xl overflow-hidden">
          <img
            src="https://picsum.photos/seed/style1/400/260"
            alt="personal style"
            className="w-full h-52 object-cover"
            style={{ filter: "brightness(1.03) saturate(1.1) sepia(0.08)" }}
          />
        </div>

        {/* Why this suggestion */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest">
            WHY THIS SUGGESTION?
          </p>
          <div className="flex gap-2 flex-wrap">
            {WHY_CHIPS.map((chip) => (
              <span
                key={chip}
                className="px-4 py-2 rounded-full text-xs font-medium border border-blue-500 text-blue-600"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-xs">
            Based on 12 past edits - updated today
          </p>
        </div>

        {/* Refine with intent */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest">
            REFINE WITH INTENT
          </p>
          <div className="flex gap-2 flex-wrap">
            {REFINE_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => setSelectedRefine(chip)}
                className={`px-4 py-2 rounded-full text-xs font-medium border ${
                  selectedRefine === chip
                    ? "border-blue-500 text-blue-600"
                    : "border-gray-200 text-gray-600"
                }`}
              >
                {chip}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => router.push("/mood/adjustment")}
          className="w-full py-4 rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm"
        >
          Adjust
        </button>

        <button
          onClick={() => router.push("/saving")}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
          style={{ background: "#f2c8d4" }}
        >
          Looks good
        </button>
      </div>
    </div>
  );
}
