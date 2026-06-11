"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function GeneratingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
  const generateMoodEdit = async () => {
    try {
      setProgress(30);

      const savedRequest = localStorage.getItem("moodEditRequest");

      if (!savedRequest) return;

      const parsedRequest = JSON.parse(savedRequest);

      setProgress(60);

      const response = await fetch("/api/mood-edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: parsedRequest.moodText || parsedRequest.presetMood || parsedRequest.libraryMood || "",
          image_name: parsedRequest.selectedPhoto?.src || "unknown.jpg",
          mode: parsedRequest.mode || "text",
          reference_image_url: parsedRequest.refImageSrc || null,
          library_preset: parsedRequest.libraryMood || null,
        }),
      });

      const data = await response.json();

      localStorage.setItem(
        "moodEditResponse",
        JSON.stringify(data)
      );

      setProgress(100);

      setTimeout(() => {
        router.replace("/mood/results");
      }, 700);

    } catch (error) {
      console.error("backend error:", error);
    }
  };

  generateMoodEdit();
}, []);

  return (
    <div className="min-h-full flex flex-col">
      {/* Top gradient */}
      <div className="reph-gradient px-6 pt-14 pb-16">
        <h1 className="text-[38px] font-bold text-gray-900 leading-tight">
          Generating
          <br />
          Results
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 bg-[#f2f2f2] px-5 py-5 flex flex-col gap-4">
        {/* Loading card */}
        <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-4">
          {/* Spinner */}
          <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-blue-400 border-t-transparent animate-spin" />
          </div>

          <p className="text-gray-700 font-semibold text-sm text-center leading-relaxed">
            Analyzing photo, lighting,
            <br />
            and mood intent...
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
