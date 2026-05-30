"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";

type EditedImage = {
  image: string;
  filter: string;
  adjustmentReason: string;
};

type ConsistencyResponse = {
  styleName: string;
  summary: string;
  editedImages: EditedImage[];
};

// consistency 0 = 원본 그대로, 100 = 백엔드 필터 100% 적용
function scaleFilter(filterStr: string, intensity: number): string {
  const t = intensity / 100;
  return filterStr.replace(/(\w+)\(([^)]+)\)/g, (_, fn, val) => {
    const isPx = val.includes("px");
    const v = parseFloat(val);
    const neutral = fn === "sepia" || fn === "blur" ? 0 : 1;
    const scaled = neutral + (v - neutral) * t;
    return isPx ? `${fn}(${scaled.toFixed(2)}px)` : `${fn}(${scaled.toFixed(2)})`;
  });
}

function ConsistencyPreviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialConsistency = Number(searchParams.get("consistency") ?? 55);
  const [consistency, setConsistency] = useState(initialConsistency);
  const [result, setResult] = useState<ConsistencyResponse | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("consistencyEditResponse");
    if (saved) {
      setResult(JSON.parse(saved));
    }
  }, []);

  // consistency 파라미터가 바뀌면 (adjusting 후 돌아올 때) 슬라이더 동기화
  useEffect(() => {
    setConsistency(Number(searchParams.get("consistency") ?? 55));
  }, [searchParams]);

  const photos = result?.editedImages ?? [];
  const photoCount = photos.length;

  return (
    <div className="h-full flex flex-col bg-[#f2f2f2]">
      <Header title="grid preview" />

      <p className="px-5 pt-1 pb-2 text-gray-500 text-sm leading-relaxed">
        Preview your edited photo set.<br />
        All selected photos were adjusted to match the chosen style.
      </p>

      {/* 스크롤 가능한 그리드 영역 */}
      <div className="flex-1 overflow-y-auto min-h-0 px-3 py-2">
        <div className="grid grid-cols-3 gap-1">
          {photos.length > 0 ? (
            photos.map((photo, index) => (
              <div key={index} className="aspect-square overflow-hidden">
                <img
                  src={photo.image}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-full object-cover"
                  style={{ filter: scaleFilter(photo.filter, consistency) }}
                />
              </div>
            ))
          ) : (
            <p className="text-gray-300 text-xs col-span-3 px-1 py-4">Loading...</p>
          )}
        </div>
      </div>

      {/* 하단 고정 영역 */}
      <div className="flex flex-col gap-3 px-4 pt-3 pb-4 bg-[#f2f2f2]">
        {/* Batch edit info */}
        <div className="bg-white rounded-2xl p-5 flex flex-col gap-4">
          <div>
            <p className="text-blue-500 text-xs font-semibold mb-1">Batch edit applied</p>
            <p className="text-gray-900 font-bold text-sm">
              {photoCount > 0
                ? `${photoCount} photo${photoCount > 1 ? "s" : ""} updated with one consistent style`
                : "Photos updated with one consistent style"}
            </p>
          </div>

          <div>
            <p className="text-gray-500 text-xs mb-2">Consistency level</p>
            <div className="flex items-center gap-2">
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
