"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";

function MoodInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [moodText, setMoodText] = useState("");
  const [hasRefImage, setHasRefImage] = useState(false);
  const [libraryMood, setLibraryMood] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const mood = searchParams.get("mood");
    if (mood) setLibraryMood(mood);
  }, [searchParams]);

  const hasInput = moodText.trim() !== "" || hasRefImage || libraryMood !== null;

  const handleGenerate = () => {
    if (!hasInput) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    router.push("/mood/generating");
  };

  const clearError = () => { if (showError) setShowError(false); };

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="mood input" />

      <p className="px-5 pt-1 pb-4 text-gray-500 text-sm">
        Describe the mood for this photo or upload a reference image.
      </p>

      <div className="px-4 flex flex-col gap-3 flex-1">
        <div className={"bg-white rounded-2xl p-4 transition-all duration-200" + (showError && !moodText.trim() ? " ring-2 ring-red-300" : "")}>
          <p className="font-bold text-gray-900 text-sm mb-2">Text input</p>
          <input
            type="text"
            value={moodText}
            onChange={(e) => { setMoodText(e.target.value); clearError(); }}
            placeholder="e.g. warm evening, soft cinematic..."
            className="w-full text-sm text-gray-500 outline-none placeholder:text-gray-400"
          />
        </div>

        <div>
          <p className="font-bold text-gray-900 text-sm mb-2">Reference image</p>
          <div className={"relative rounded-2xl overflow-hidden h-48 transition-all duration-200" + (showError && !hasRefImage ? " ring-2 ring-red-300" : "")}>
            {hasRefImage ? (
              <img src="https://picsum.photos/seed/reph5/400/300" alt="reference" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <span className="text-gray-300 text-sm">No image selected</span>
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                onClick={() => { setHasRefImage(true); clearError(); }}
                className="bg-white/90 rounded-full px-5 py-2 text-sm font-semibold text-gray-800 shadow"
              >
                {hasRefImage ? "Change image" : "+ Upload image"}
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={() => router.push("/library?from=mood-input")}
          className={"rounded-2xl p-4 text-center shadow-sm w-full transition-all duration-200" + (libraryMood ? " bg-[#f2c8d4]/30 ring-2 ring-[#f2c8d4]" : showError ? " bg-white ring-2 ring-red-300" : " bg-white")}
        >
          <p className="font-bold text-gray-900 text-sm">Open Library</p>
          {libraryMood ? (
            <p className="text-[#d4829a] text-xs font-semibold mt-1">{libraryMood}</p>
          ) : (
            <p className="text-gray-400 text-xs mt-0.5">Use saved moods and previous preferences</p>
          )}
        </button>
      </div>

      <div className="px-4 py-4 flex flex-col gap-2">
        <div className={"flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 transition-all duration-300" + (showError ? " opacity-100 translate-y-0" : " opacity-0 translate-y-2 pointer-events-none")}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
            <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M8 5v3.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="#ef4444" />
          </svg>
          <p className="text-red-500 text-xs font-medium">
            Please enter a mood, upload an image, or select from Library.
          </p>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm"
          style={{ background: "#f2c8d4" }}
        >
          Generate edits -&gt;
        </button>
      </div>
    </div>
  );
}

export default function MoodInputPage() {
  return (
    <Suspense>
      <MoodInputContent />
    </Suspense>
  );
}
