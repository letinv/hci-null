"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

const DEFAULT_OPTIONS = [
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
  const [basePhoto, setBasePhoto] = useState<string>("");
  const [options, setOptions] = useState(DEFAULT_OPTIONS);
  const [fullscreenIndex, setFullscreenIndex] = useState<number | null>(null);
  const [zoomScale, setZoomScale] = useState(1);
  const imageContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedPhoto = localStorage.getItem("selectedMoodPhoto");
    if (savedPhoto) {
      const parsedPhoto = JSON.parse(savedPhoto);
      setBasePhoto(parsedPhoto.src);
      const savedResponse = localStorage.getItem("moodEditResponse");
      if (savedResponse) {
        const parsedResponse = JSON.parse(savedResponse);
        if (parsedResponse.generatedResults) {
          setOptions(parsedResponse.generatedResults);
        }
      }
    }
  }, []);

  if (!basePhoto) return null;

  // original + options 통합 배열
  const allItems = [
    { id: "original", label: "Original photo", filter: "" },
    ...options,
  ];

  const openFullscreen = (index: number) => { setFullscreenIndex(index); setZoomScale(1); };
  const closeFullscreen = () => { setFullscreenIndex(null); setZoomScale(1); };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoomScale((prev) => Math.min(3, Math.max(1, prev + (e.deltaY < 0 ? 0.2 : -0.2))));
  };
  const prevOption = () => { setZoomScale(1); setFullscreenIndex((i) => (i !== null ? (i - 1 + allItems.length) % allItems.length : null)); };
  const nextOption = () => { setZoomScale(1); setFullscreenIndex((i) => (i !== null ? (i + 1) % allItems.length : null)); };

  const fullscreenItem = fullscreenIndex !== null ? allItems[fullscreenIndex] : null;

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="results" />

      <div className="px-4 flex flex-col gap-3 pb-6">
        {/* Original */}
        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-2 px-1">
            ORIGINAL
          </p>
          <button
            onClick={() => openFullscreen(0)}
            className="relative rounded-2xl overflow-hidden w-full block"
          >
            <img
              src={basePhoto}
              alt="original"
              className="w-full h-44 object-cover"
            />
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2">
              <span className="bg-white/80 rounded-full px-4 py-1 text-xs font-semibold text-gray-700 whitespace-nowrap">
                Original photo
              </span>
            </div>
          </button>
        </div>

        {/* Edited options */}
        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-2 px-1">
            EDITED OPTIONS
          </p>
          <div className="flex flex-col gap-3">
            {options.map((opt, index) => (
              <div key={opt.id} className="relative rounded-2xl overflow-hidden">
                {/* 이미지 클릭 → 선택 */}
                <button
                  onClick={() => setSelected(opt.id)}
                  className="relative w-full text-left block"
                >
                  <img
                    src={basePhoto}
                    alt={opt.label}
                    className="w-full h-44 object-cover"
                    style={{ filter: opt.filter }}
                  />
                </button>

                {/* 선택 테두리 */}
                {selected === opt.id && (
                  <div className="absolute inset-0 rounded-2xl ring-2 ring-blue-500 pointer-events-none" />
                )}

                {/* 우상단 체크박스 */}
                <button
                  onClick={() => setSelected(opt.id)}
                  className="absolute top-3 right-3"
                >
                  {selected === opt.id ? (
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  ) : (
                    <div className="w-6 h-6 bg-black/30 rounded-full border-2 border-white/70" />
                  )}
                </button>

                {/* 옵션 라벨 + 확대 아이콘 */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  <span className="bg-white/80 rounded-full px-4 py-1 text-xs font-semibold text-gray-700 whitespace-nowrap">
                    {opt.label}
                  </span>
                  <button
                    onClick={() => openFullscreen(index + 1)}
                    className="bg-white/80 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0"
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                      <path d="M1 4.5V1h3.5M7.5 1H11v3.5M11 7.5V11H7.5M4.5 11H1V7.5" stroke="#555" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            const selectedOption = options.find((o) => o.id === selected);
            if (selectedOption) {
              localStorage.setItem("selectedResultOption", JSON.stringify(selectedOption));
            }
            router.push("/mood/adjustment");
          }}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
          style={{ background: "#f2c8d4" }}
        >
          Adjust / Fine-tune
        </button>
      </div>

      {/* Fullscreen overlay */}
      {fullscreenItem && (
        <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center">
          {/* X button */}
          <button
            onClick={closeFullscreen}
            className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/20 flex items-center justify-center z-10"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>

          {/* Label */}
          <p className="absolute top-6 left-0 right-0 text-center text-white text-sm font-semibold">
            {fullscreenItem.label}
          </p>

          {/* Photo — landscape 비율 */}
          <div
            ref={imageContainerRef}
            className="w-full overflow-hidden"
            style={{ aspectRatio: "16/9", maxHeight: "60vh" }}
            onWheel={handleWheel}
          >
            <img
              src={basePhoto}
              alt={fullscreenItem.label}
              className="w-full h-full object-cover"
              style={{
                filter: fullscreenItem.filter || "none",
                transform: `scale(${zoomScale})`,
                transition: "transform 0.15s ease",
                transformOrigin: "center center",
              }}
            />
          </div>

          {/* Dots */}
          <div className="flex gap-2 mt-4">
            {allItems.map((_, i) => (
              <div
                key={i}
                className={`w-1.5 h-1.5 rounded-full ${i === fullscreenIndex ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </div>

          {/* Bottom arrows */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-16">
            <button
              onClick={prevOption}
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13 4l-6 6 6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={nextOption}
              className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M7 4l6 6-6 6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
