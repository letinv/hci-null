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
  const [presetSaving, setPresetSaving] = useState(false);
  const [presetError, setPresetError] = useState(false);
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [presetName, setPresetName] = useState("");

  const [basePhoto, setBasePhoto] = useState("");
  const [baseFilter, setBaseFilter] = useState("");
  const [hasAdjusted, setHasAdjusted] = useState(false);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("selectedMoodPhoto");
    if (savedPhoto) {
      setBasePhoto(JSON.parse(savedPhoto).src);
    }
    const savedOption = localStorage.getItem("selectedResultOption");
    if (savedOption) {
      setBaseFilter(JSON.parse(savedOption).filter);
    }
  }, []);

  const handleChip = (chip: typeof CHIPS[number]) => {
    setSelectedChip(chip.label);
    setWarmth(Math.min(100, Math.max(0, BASE.warmth + chip.delta.warmth)));
    setIntensity(Math.min(100, Math.max(0, BASE.intensity + chip.delta.intensity)));
    setSoftness(Math.min(100, Math.max(0, BASE.softness + chip.delta.softness)));
    setHasAdjusted(true);
  };

  const makeSetterWithFlag = (setter: (v: number) => void) => (v: number) => {
    setter(v);
    setHasAdjusted(true);
  };

  const sliders = [
    { label: "warmth",    value: warmth,    setter: makeSetterWithFlag(setWarmth) },
    { label: "intensity", value: intensity, setter: makeSetterWithFlag(setIntensity) },
    { label: "softness",  value: softness,  setter: makeSetterWithFlag(setSoftness) },
  ];

  // 백엔드 /adjust-edit 수식과 동일하게 실시간 filter 계산
  const computedFilter = [
    `brightness(${(1 + (intensity - 50) / 250).toFixed(2)})`,
    `contrast(${(1 + (intensity - 50) / 200).toFixed(2)})`,
    `saturate(${(1 + (warmth - 50) / 180).toFixed(2)})`,
    `sepia(${Math.max(0, Math.min(0.35, warmth / 300)).toFixed(2)})`,
    `blur(${Math.max(0, (softness - 50) / 80).toFixed(2)}px)`,
  ].join(" ");

  if (!basePhoto) {
    return null;
  }

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2] relative">
      <Header title="adjustment" />

      <div className="px-4 flex flex-col gap-4 pb-6">
        {/* Photo */}
        <div className="relative rounded-2xl overflow-hidden">
          <img
            src={basePhoto}
            alt="adjusted"
            className="w-full h-52 object-cover"
            style={{ filter: hasAdjusted ? computedFilter : (baseFilter || computedFilter) }}
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
            disabled={presetSaving}
            onClick={() => {
              const moodReq = localStorage.getItem("moodEditRequest");
              const defaultName = moodReq ? JSON.parse(moodReq).moodText : "";
              setPresetName(defaultName);
              setShowNameDialog(true);
            }}
            className="w-full py-4 rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm disabled:opacity-50"
          >
            {presetSaving ? "Saving..." : presetSaved ? "Preset saved ✓" : presetError ? "Failed — tap to retry" : "Save this mood preset"}
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

      {/* Name input dialog */}
    {showNameDialog && (
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-8 z-50">
        <div className="bg-white rounded-2xl p-6 w-full flex flex-col gap-4">
          <p className="text-gray-900 font-bold text-base">Name this preset</p>
          <input
            type="text"
            value={presetName}
            onChange={(e) => setPresetName(e.target.value)}
            placeholder="e.g. warm evening, soft cinematic..."
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-300"
            autoFocus
          />
          <div className="flex gap-3">
            <button
              onClick={() => { setShowNameDialog(false); setPresetName(""); }}
              className="flex-1 py-3 rounded-full border border-gray-200 text-gray-600 font-medium text-sm"
            >
              Cancel
            </button>
            <button
              disabled={!presetName.trim()}
              onClick={async () => {
                const resultOpt = localStorage.getItem("selectedResultOption");
                const option = resultOpt ? JSON.parse(resultOpt) : null;
                const currentFilter = hasAdjusted ? computedFilter : (baseFilter || computedFilter);
                setShowNameDialog(false);
                setPresetSaving(true);
                setPresetError(false);
                try {
                  await fetch("http://127.0.0.1:8000/save-preset", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      mood: presetName.trim(),
                      style_name: option?.label ?? "custom",
                      selected_option: option?.id ?? "A",
                      filter: currentFilter,
                      tags: option?.tags ?? [],
                      explanation: option?.explanation ?? "",
                    }),
                  });
                  setPresetSaved(true);
                  setTimeout(() => setPresetSaved(false), 2000);
                } catch {
                  setPresetError(true);
                } finally {
                  setPresetSaving(false);
                }
              }}
              className="flex-1 py-3 rounded-full text-gray-800 font-semibold text-sm disabled:opacity-40"
              style={{ background: "#f2c8d4" }}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
