"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";
import GalleryPicker from "../../components/GalleryPicker";

type InputMode = "text" | "image" | "library" | null;

function MoodInputContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<InputMode>(null);
  const [moodText, setMoodText] = useState("");
  const [refImage, setRefImage] = useState<{ id: number; src: string } | null>(null);
  const [libraryMood, setLibraryMood] = useState<string | null>(null);
  const [showError, setShowError] = useState(false);
  const [showGallery, setShowGallery] = useState(false);

  useEffect(() => {
    const mood = searchParams.get("mood");
    if (mood) {
      setLibraryMood(mood);
      setMode("library");
      setMoodText("");
      setRefImage(null);
    }
  }, [searchParams]);

  const hasInput = moodText.trim() !== "" || refImage !== null || libraryMood !== null;

  const handleModeSelect = (selected: InputMode) => {
    setMode(selected);
    setMoodText("");
    setRefImage(null);
    setLibraryMood(null);
    setShowError(false);
    if (selected === "image") setShowGallery(true);
    if (selected === "library") router.push("/library?from=mood-input");
  };

  const handleGenerate = () => {
    if (!hasInput) {
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
      return;
    }
    const selectedPhoto = localStorage.getItem("selectedMoodPhoto");
    localStorage.setItem("moodEditRequest", JSON.stringify({
      moodText: moodText.trim(),
      hasRefImage: refImage !== null,
      libraryMood,
      selectedPhoto: selectedPhoto ? JSON.parse(selectedPhoto) : null,
    }));
    router.push("/mood/generating");
  };

  const MODES = [
    { key: "text",    label: "Text" },
    { key: "image",   label: "Reference Image" },
    { key: "library", label: "Library" },
  ] as const;

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="mood input" />

      <p className="px-5 pt-1 pb-4 text-gray-500 text-sm">
        Choose how you want to describe the mood for this photo.
      </p>

      <div className="px-4 flex flex-col gap-4 flex-1">
        {/* 3 mode buttons */}
        <div className="flex gap-2">
          {MODES.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => handleModeSelect(key)}
              className={"flex-1 py-3 rounded-2xl text-xs font-semibold border transition-all duration-150 " + (mode === key
                ? "bg-white border-blue-400 text-blue-600 shadow-sm"
                : "bg-white border-gray-200 text-gray-500")}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Content area */}
        {mode === "text" && (
          <div className="bg-white rounded-2xl p-4">
            <input
              type="text"
              value={moodText}
              onChange={(e) => { setMoodText(e.target.value); setShowError(false); }}
              placeholder="e.g. warm evening, soft cinematic..."
              className="w-full text-sm text-gray-600 outline-none placeholder:text-gray-300"
              autoFocus
            />
          </div>
        )}

        {mode === "image" && (
          <div className="relative rounded-2xl overflow-hidden h-48">
            {refImage ? (
              <>
                <img src={refImage.src} alt="reference" className="w-full h-full object-cover" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => setShowGallery(true)}
                    className="bg-white/90 rounded-full px-5 py-2 text-sm font-semibold text-gray-800 shadow"
                  >
                    Change image
                  </button>
                </div>
              </>
            ) : (
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center">
                <span className="text-gray-300 text-sm">No image selected</span>
              </div>
            )}
          </div>
        )}

        {mode === "library" && libraryMood && (
          <div className="bg-white rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-400 mb-0.5">Selected mood</p>
              <p className="text-gray-900 font-semibold text-sm">{libraryMood}</p>
            </div>
            <button
              onClick={() => router.push("/library?from=mood-input")}
              className="text-blue-500 text-xs font-medium"
            >
              Change
            </button>
          </div>
        )}
      </div>

      <div className="px-4 py-4 flex flex-col gap-2">
        <div className={"flex items-center gap-2 bg-red-50 border border-red-200 rounded-2xl px-4 py-3 transition-all duration-300" + (showError ? " opacity-100 translate-y-0" : " opacity-0 translate-y-2 pointer-events-none")}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0">
            <circle cx="8" cy="8" r="7" stroke="#ef4444" strokeWidth="1.5" />
            <path d="M8 5v3.5" stroke="#ef4444" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="8" cy="11" r="0.75" fill="#ef4444" />
          </svg>
          <p className="text-red-500 text-xs font-medium">
            Please select an input method and provide your mood.
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

      {showGallery && (
        <GalleryPicker
          onSelect={(photo) => { setRefImage(photo); setShowGallery(false); }}
          onClose={() => { setShowGallery(false); if (!refImage) setMode(null); }}
        />
      )}
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
