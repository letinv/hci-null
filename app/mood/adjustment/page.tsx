"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

const BASE = { warmth: 50, intensity: 50, softness: 50 };

const CHIPS = [
  { label: "slightly warmer", delta: { warmth: +15, intensity: +5,  softness:   0 } },
  { label: "softer tone",     delta: { warmth:   0, intensity: -10, softness: +20 } },
  { label: "less intense",    delta: { warmth:   0, intensity: -25, softness: +10 } },
];

export default function AdjustmentPage() {
  const router = useRouter();
  const [warmth, setWarmth] = useState(50);
  const [intensity, setIntensity] = useState(50);
  const [softness, setSoftness] = useState(50);
  const [selectedChip, setSelectedChip] = useState<string | null>(null);
  const [presetSaved, setPresetSaved] = useState(false);

  const [basePhoto, setBasePhoto] = useState("");

useEffect(() => {
  const savedPhoto = localStorage.getItem("selectedMoodPhoto");

  if (savedPhoto) {
    const parsedPhoto = JSON.parse(savedPhoto);
    setBasePhoto(parsedPhoto.src);
  }
}, []);

  const handleChip = (chip: typeof CHIPS[number]) => {
    setSelectedChip(chip.label);
    setWarmth(Math.min(100, Math.max(0, BASE.warmth + chip.delta.warmth)));
    setIntensity(Math.min(100, Math.max(0, BASE.intensity + chip.delta.intensity)));
    setSoftness(Math.min(100, Math.max(0, BASE.softness + chip.delta.softness)));
  };

  const sliders = [
    { label: "warmth",    value: warmth,    setter: setWarmth },
    { label: "intensity", value: intensity, setter: setIntensity },
    { label: "softness",  value: softness,  setter: setSoftness },
  ];

  if (!basePhoto) {
  return null;
}

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="adjustment" />

      <div className="px-4 flex flex-col gap-4 pb-6">
        {/* Photo */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={basePhoto}
            alt="adjusted"
            className="w-full h-44 object-cover"
            style={{ filter: "brightness(1.05) contrast(1.15) saturate(0.85)" }}
          />
        </div>

        {/* Fine-tune sliders */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
          <p className="font-bold text-gray-900 text-base">Fine-tune</p>
          {sliders.map(({ label, value, setter }) => (
            <div key={label}>
              <div className="flex justify-between mb-2">
                <span className="text-gray-500 text-xs">{label}</span>
                <span className="text-gray-500 text-xs">{value}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                onTouchStart={(e) => e.stopPropagation()}
                className="w-full h-1 accent-blue-500"
                style={{ touchAction: "none" }}
              />
            </div>
          ))}
        </div>

        {/* Intent chips */}
        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-3">
            INTENT-BASED ADJUSTMENTS
          </p>
          <div className="flex gap-2 flex-wrap">
            {CHIPS.map((chip) => (
              <button
                key={chip.label}
                onClick={() => handleChip(chip)}
                className={`px-4 py-2 rounded-full text-xs font-medium border ${
                  selectedChip === chip.label
                    ? "border-blue-500 text-blue-600 bg-white"
                    : "border-gray-200 bg-white text-gray-600"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Save to library */}
        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-3">
            SAVE TO LIBRARY
          </p>
           <button
             onClick={() => setPresetSaved(true)}
             className="w-full py-4 rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm"
           >
             {presetSaved ? "Preset saved ✓" : "Save this mood preset"}
           </button>
        </div>

        {/* Save / Export */}
        <button
          onClick={() => router.push("/saving")}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
          style={{ background: "#f2c8d4" }}
        >
          Save / Export
        </button>
      </div>
    </div>
  );
}
