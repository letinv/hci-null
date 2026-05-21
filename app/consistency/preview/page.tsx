"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";

const PREVIEW_PHOTOS = [
  { label: "Photo 1", src: "https://picsum.photos/seed/batch1/200/250" },
  { label: "Photo 2", src: "https://picsum.photos/seed/batch2/200/250" },
  { label: "Photo 3", src: "https://picsum.photos/seed/batch3/200/250" },
];

function ConsistencyPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialConsistency = Number(searchParams.get("consistency") ?? 55);
  const [consistency, setConsistency] = useState(initialConsistency);

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="grid preview" />

      <p className="px-5 pt-1 pb-4 text-gray-500 text-sm leading-relaxed">
        Preview your edited photo set.<br />
        All selected photos were adjusted to match the chosen style.
      </p>

      <div className="px-4 flex flex-col gap-4">
        {/* Photo strip */}
        <div className="bg-white rounded-2xl p-4">
          <div className="flex gap-2">
            {PREVIEW_PHOTOS.map((photo) => (
              <div key={photo.label} className="flex-1 relative rounded-xl overflow-hidden">
                <img
                  src={photo.src}
                  alt={photo.label}
                  className="w-full h-32 object-cover"
                  style={{ filter: "saturate(0.9) brightness(1.02)" }}
                />
                <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2">
                  <span className="bg-black/50 text-white text-[10px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap">
                    {photo.label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Batch edit info */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <p className="text-blue-500 text-xs font-semibold mb-1">Batch edit applied</p>
            <p className="text-gray-900 font-bold text-sm">
              3 photos updated with one consistent style
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-2">Consistency level</p>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-gray-400 text-[10px] whitespace-nowrap">More natural</span>
              <input
                type="range"
                min={0}
                max={100}
                value={consistency}
                onChange={(e) => setConsistency(Number(e.target.value))}
                onTouchStart={(e) => e.stopPropagation()}
                className="flex-1 h-1 accent-blue-500"
                style={{ touchAction: "none" }}
              />
              <span className="text-gray-400 text-[10px] whitespace-nowrap">More unified</span>
            </div>
          </div>

          <button
            onClick={() => router.push("/consistency/adjusting?consistency=" + consistency)}
            className="w-full py-3.5 rounded-full border border-gray-200 text-gray-700 font-medium text-sm"
          >
            Adjust consistency
          </button>
        </div>

        <button
          onClick={() => router.push("/saving")}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
          style={{ background: "#f2c8d4" }}
        >
          Save / Export all
        </button>
      </div>
    </div>
  );
}

export default function ConsistencyPreviewPage() {
  return (
    <Suspense>
      <ConsistencyPreviewContent />
    </Suspense>
  );
}
