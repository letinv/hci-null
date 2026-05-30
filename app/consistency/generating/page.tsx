"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ConsistencyGeneratingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const generate = async () => {
      try {
        setProgress(30);

        const savedPhotos = localStorage.getItem("consistencySelectedPhotos");
        const savedStyle = localStorage.getItem("consistencyStyleRequest");

        if (!savedPhotos || !savedStyle) return;

        const photos = JSON.parse(savedPhotos) as { id: number; src: string }[];
        const { preset } = JSON.parse(savedStyle) as { preset: string };

        setProgress(60);

        const response = await fetch("http://127.0.0.1:8000/consistency-edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            images: photos.map((p) => p.src),
            preset,
          }),
        });

        const data = await response.json();
        localStorage.setItem("consistencyEditResponse", JSON.stringify(data));

        setProgress(100);
        setTimeout(() => router.replace("/consistency/preview"), 700);
      } catch (error) {
        console.error("backend error:", error);
      }
    };

    generate();
  }, []);

  return (
    <div className="min-h-full flex flex-col">
      {/* Top gradient */}
      <div className="reph-gradient px-6 pt-14 pb-16">
        <h1 className="text-[38px] font-bold text-gray-900 leading-tight">
          Applying
          <br />
          Style
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#f2f2f2] px-5 py-5 flex flex-col gap-4">
        <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
          </div>

          <p className="text-gray-700 font-semibold text-sm text-center leading-relaxed">
            Analyzing style and applying
            <br />
            consistency across photos...
          </p>

          {/* Progress bar */}
          <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-[800ms] ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
