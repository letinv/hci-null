"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";

const BASE = { warmth: 50, intensity: 50, softness: 50 };

const REFINE_CHIPS = [
  { label: "slightly warmer", delta: { warmth: +15, intensity: +5,  softness:   0 } },
  { label: "softer",          delta: { warmth:   0, intensity: -10, softness: +20 } },
  { label: "less intense",    delta: { warmth:   0, intensity: -25, softness: +10 } },
];

type PersonalStyleResponse = {
  suggestedStyle: string;
  traits: string[];
  basedOn: number;
  reason: string;
  suggestedEdit: {
    label: string;
    filter: string;
    explanation: string;
  };
};

function computeFilter(warmth: number, intensity: number, softness: number): string {
  return [
    `brightness(${(1 + (intensity - 50) / 250).toFixed(2)})`,
    `contrast(${(1 + (intensity - 50) / 200).toFixed(2)})`,
    `saturate(${(1 + (warmth - 50) / 180).toFixed(2)})`,
    `sepia(${Math.max(0, Math.min(0.35, warmth / 300)).toFixed(2)})`,
    `blur(${Math.max(0, (softness - 50) / 80).toFixed(2)}px)`,
  ].join(" ");
}

export default function PersonalStylePage() {
  const router = useRouter();
  const [selectedRefine, setSelectedRefine] = useState<string | null>(null);
  const [basePhoto, setBasePhoto] = useState("");
  const [result, setResult] = useState<PersonalStyleResponse | null>(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("selectedMoodPhoto");
    if (savedPhoto) {
      const photo = JSON.parse(savedPhoto);
      setBasePhoto(photo.src);

      fetch("https://hci-null-production.up.railway.app/personal-style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image_name: photo.src }),
      })
        .then((res) => res.json())
        .then((data) => setResult(data))
        .catch(() => {});
    }
  }, []);

  const handleChip = (chip: typeof REFINE_CHIPS[number]) => {
    setSelectedRefine(chip.label);
  };

  // 칩 선택 시 delta 적용한 filter, 없으면 백엔드 추천 filter
  const activeChip = REFINE_CHIPS.find((c) => c.label === selectedRefine);
  const photoFilter = activeChip
    ? computeFilter(
        Math.min(100, Math.max(0, BASE.warmth + activeChip.delta.warmth)),
        Math.min(100, Math.max(0, BASE.intensity + activeChip.delta.intensity)),
        Math.min(100, Math.max(0, BASE.softness + activeChip.delta.softness))
      )
    : (result?.suggestedEdit?.filter ?? "brightness(1.03) saturate(1.1) sepia(0.08)");

  const traits = result?.traits ?? ["warm tones", "soft contrast", "cinematic"];
  const basedOn = result?.basedOn ?? 0;

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
        {basePhoto && (
          <div className="rounded-2xl overflow-hidden">
            <img
              src={basePhoto}
              alt="personal style"
              className="w-full h-52 object-cover"
              style={{ filter: photoFilter, transition: "filter 0.3s ease" }}
            />
          </div>
        )}

        {/* Why this suggestion */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-3">
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest">
            WHY THIS SUGGESTION?
          </p>
          <div className="flex gap-2 flex-wrap">
            {traits.map((chip) => (
              <span
                key={chip}
                className="px-4 py-2 rounded-full text-xs font-medium border border-blue-500 text-blue-600"
              >
                {chip}
              </span>
            ))}
          </div>
          <p className="text-gray-400 text-xs">
            {basedOn > 0
              ? `Based on ${basedOn} past edit${basedOn > 1 ? "s" : ""} — updated today`
              : "No past edits yet — using default style"}
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
                key={chip.label}
                onClick={() => handleChip(chip)}
                className={`px-4 py-2 rounded-full text-xs font-medium border ${
                  selectedRefine === chip.label
                    ? "border-blue-500 text-blue-600 bg-white"
                    : "border-gray-200 text-gray-600 bg-white"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Buttons */}
        <button
          onClick={() => {
            localStorage.setItem(
              "selectedResultOption",
              JSON.stringify({ filter: photoFilter, label: "personal style", id: "personal" })
            );
            router.push("/mood/adjustment");
          }}
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
