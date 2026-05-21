"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";

export default function ConsistencyStylePage() {
  const router = useRouter();
  const [styleText, setStyleText] = useState("");

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="style selection" />

      <p className="px-5 pt-1 pb-4 text-gray-500 text-sm">
        Describe the style for this photo set or upload a reference image.
      </p>

      <div className="px-4 flex flex-col gap-3 flex-1">
        {/* Text input card */}
        <div className="bg-white rounded-2xl p-4">
          <p className="font-bold text-gray-900 text-sm mb-2">Text input</p>
          <input
            type="text"
            value={styleText}
            onChange={(e) => setStyleText(e.target.value)}
            placeholder="e.g. cohesive pastel feed, soft blue mood..."
            className="w-full text-sm text-gray-500 outline-none placeholder:text-gray-400"
          />
        </div>

        {/* Reference image */}
        <div>
          <p className="font-bold text-gray-900 text-sm mb-2">Reference image</p>
          <div className="relative rounded-2xl overflow-hidden h-48">
            <img
              src="https://picsum.photos/seed/batch5/400/300"
              alt="reference"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="bg-white/90 rounded-full px-5 py-2 text-sm font-semibold text-gray-800 shadow">
                + Upload image
              </button>
            </div>
          </div>
        </div>

        {/* Open Library */}
        <button className="bg-white rounded-2xl p-4 text-center shadow-sm w-full">
          <p className="font-bold text-gray-900 text-sm">Open Library</p>
          <p className="text-gray-400 text-xs mt-0.5">
            Use saved moods and previous preferences
          </p>
        </button>
      </div>

      <div className="px-4 py-4">
        <button
          onClick={() => router.push("/consistency/preview")}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
          style={{ background: "#f2c8d4" }}
        >
          Apply consistent style →
        </button>
      </div>
    </div>
  );
}
