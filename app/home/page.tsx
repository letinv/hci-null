"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Preset = {
  id: number;
  mood: string;
  styleName: string;
  selectedOption: string;
  filter: string;
  tags: string[];
};

type GalleryImage = { id: number; src: string };

export default function HomePage() {
  const router = useRouter();
  const [recentMoods, setRecentMoods] = useState<Preset[]>([]);
  const [recentImages, setRecentImages] = useState<GalleryImage[]>([]);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/library")
      .then((res) => res.json())
      .then((data) => {
        const presets: Preset[] = data.presets ?? [];
        setRecentMoods(presets.slice(-2).reverse());
      })
      .catch(() => setRecentMoods([]));

    fetch("http://127.0.0.1:8000/gallery")
      .then((res) => res.json())
      .then((data) => setRecentImages((data.images ?? []).slice(0, 4)))
      .catch(() => setRecentImages([]));
  }, []);

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      {/* Top gradient section */}
      <div className="reph-gradient relative px-6 pt-14 pb-16">
        {/* Settings button */}
        <button
          onClick={() => router.push("/settings")}
          className="absolute top-12 right-6 w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600"
          aria-label="Open settings"
        >
          <svg
            width="21"
            height="21"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06A1.65 1.65 0 0 0 15 19.4a1.65 1.65 0 0 0-1 .6 1.65 1.65 0 0 0-.4 1v.2a2 2 0 1 1-4 0V21a1.65 1.65 0 0 0-.4-1 1.65 1.65 0 0 0-1-.6 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-.6-1 1.65 1.65 0 0 0-1-.4h-.2a2 2 0 1 1 0-4H3a1.65 1.65 0 0 0 1-.4 1.65 1.65 0 0 0 .6-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-.6 1.65 1.65 0 0 0 .4-1v-.2a2 2 0 1 1 4 0V3a1.65 1.65 0 0 0 .4 1 1.65 1.65 0 0 0 1 .6 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9c.4.2.7.5 1 .6.3.2.6.2 1 .2h.2a2 2 0 1 1 0 4h-.2c-.4 0-.7.1-1 .2-.3.1-.6.4-1 .6z" />
          </svg>
        </button>

        <h1 className="text-[38px] font-bold text-gray-900 leading-tight">
          Edit by
          <br />
          Mood
        </h1>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 px-5 py-5 flex flex-col gap-4">
        {/* Action card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm flex flex-col gap-3">
          <p className="text-gray-800 font-semibold text-[15px]">
            What would you like to do?
          </p>

          <button
            onClick={() => router.push("/mood/select-photo")}
            className="w-full py-[14px] rounded-full text-gray-800 font-semibold text-sm"
            style={{ background: "#f2c8d4" }}
          >
            Start a new mood edit
          </button>
          <button
            onClick={() => router.push("/consistency/select")}
            className="w-full py-[14px] rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm"
          >
            Edit multiple photos consistently
          </button>
          <button
            onClick={() => router.push("/mood/select-photo?from=personal-style")}
            className="w-full py-[14px] rounded-full border border-gray-200 bg-white text-gray-700 font-medium text-sm"
          >
            Use my personal style
          </button>
        </div>

        {/* Recent moods */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-gray-800 font-semibold text-sm">Recent moods</p>
            <button onClick={() => router.push("/library")} className="text-gray-400 text-lg leading-none">›</button>
          </div>
          <div className="flex flex-col gap-2">
            {recentMoods.length === 0 ? (
              <p className="text-gray-300 text-xs px-1">No saved moods yet</p>
            ) : (
              recentMoods.map((mood) => (
                <div
                  key={mood.id}
                  className="bg-white rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm"
                >
                  <div
                    className="w-12 h-12 rounded-2xl flex-shrink-0"
                    style={{ background: "#f5ee9a" }}
                  />
                  <div>
                    <p className="text-gray-900 font-semibold text-sm">
                      {mood.mood}
                    </p>
                    <p className="text-gray-400 text-xs mt-0.5">
                      {mood.styleName}{mood.tags.length > 0 ? " · " + mood.tags.slice(0, 2).join(", ") : ""}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent images */}
        <div>
          <p className="text-gray-800 font-semibold text-sm mb-3">Recent images</p>
          <div className="grid grid-cols-4 gap-2">
            {recentImages.map((img) => (
              <div key={img.id} className="rounded-xl overflow-hidden aspect-square">
                <img src={img.src} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
