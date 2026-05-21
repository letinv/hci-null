"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

const PHOTOS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  src: `https://picsum.photos/seed/batch${i + 1}/200/200`,
}));

export default function ConsistencySelectPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<number[]>([]);
  const [showError, setShowError] = useState(false);

  const toggle = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
    if (showError) setShowError(false);
  };

  const handleNext = () => {
    if (selected.length < 2) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    router.push("/consistency/style");
  };

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="grid photo selection" />

      <p className="px-5 pt-1 pb-3 text-gray-500 text-sm">
        Choose multiple photos from your album.
      </p>

      <div className="mx-4 bg-white rounded-2xl p-4 flex-1">
        <div className="flex items-center justify-between mb-1">
          <p className="font-bold text-gray-900 text-base">Recents</p>
          {selected.length > 0 && (
            <span className="bg-indigo-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full">
              {selected.length} selected
            </span>
          )}
        </div>
        <p className="text-gray-400 text-xs mb-3">Tap to select multiple images</p>

        <div className="grid grid-cols-3 gap-1.5">
          {PHOTOS.map((photo) => {
            const order = selected.indexOf(photo.id);
            const isSelected = order !== -1;
            return (
              <button
                key={photo.id}
                onClick={() => toggle(photo.id)}
                className="relative aspect-square rounded-xl overflow-hidden"
              >
                <img
                  src={photo.src}
                  alt={`photo ${photo.id}`}
                  className="w-full h-full object-cover"
                />
                {isSelected && (
                  <>
                    <div className="absolute inset-0 border-[3px] border-blue-500 rounded-xl" />
                    <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-indigo-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">
                        {order + 1}
                      </span>
                    </div>
                  </>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-4 flex flex-col gap-2">
        <div className={"flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 transition-all duration-300" + (showError ? " opacity-100 translate-y-0" : " opacity-0 translate-y-2 pointer-events-none")}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
            <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M8 5v3.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="#ef4444" />
          </svg>
          <p className="text-red-500 text-xs font-medium">
            Please select at least 2 photos to continue.
          </p>
        </div>

        <button
          onClick={handleNext}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
          style={{ background: "#f2c8d4" }}
        >
          {selected.length > 0
            ? `Apply to ${selected.length} photo${selected.length > 1 ? "s" : ""}`
            : "Select photos first"}
        </button>
      </div>
    </div>
  );
}
