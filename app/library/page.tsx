"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Header from "../components/Header";
import { Suspense, useEffect, useState } from "react";

type Preset = {
  id: number;
  mood: string;
  styleName: string;
  selectedOption: string;
  filter: string;
  tags: string[];
};

function LibraryContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const isFromMoodInput = from === "mood-input";
  const isFromConsistency = from === "consistency-style";
  const isSelectable = isFromMoodInput || isFromConsistency;

  const [presets, setPresets] = useState<Preset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [checkedIds, setCheckedIds] = useState<number[]>([]);

  useEffect(() => {
    fetch("https://hci-null-production.up.railway.app/library")
      .then((res) => res.json())
      .then((data) => setPresets((data.presets ?? []).slice().reverse()))
      .catch(() => setPresets([]))
      .finally(() => setLoading(false));
  }, []);

  const handleMoodSelect = (moodName: string) => {
    if (!isSelectable) return;
    if (isFromMoodInput) {
      router.push("/mood/input?mood=" + encodeURIComponent(moodName));
    } else if (isFromConsistency) {
      router.push("/consistency/style?mood=" + encodeURIComponent(moodName));
    }
  };

  const toggleCheck = (id: number) => {
    setCheckedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    await Promise.all(
      checkedIds.map((id) =>
        fetch(`https://hci-null-production.up.railway.app/delete-preset/${id}`, { method: "DELETE" }).catch(() => {})
      )
    );
    setPresets((prev) => prev.filter((p) => !checkedIds.includes(p.id)));
    setCheckedIds([]);
    setEditMode(false);
  };

  const handleCancel = () => {
    setCheckedIds([]);
    setEditMode(false);
  };

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="saved presets" />

      <div className="px-4 flex flex-col gap-5 flex-1">
        <div className="flex flex-col flex-1">
          <div className="flex items-center justify-between mb-3 px-1">
            <p className="text-gray-400 text-[10px] font-semibold tracking-widest">
              SAVED MOODS
            </p>
            {!editMode && !loading && presets.length > 0 && (
              <button
                onClick={() => setEditMode(true)}
                className="text-blue-500 text-xs font-medium"
              >
                Edit
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2 flex-1">
            {loading ? (
              <p className="text-gray-400 text-xs px-1">Loading...</p>
            ) : presets.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-2 py-20">
                <p className="text-gray-400 text-base font-semibold">No saved moods yet</p>
                <p className="text-gray-300 text-sm">Save a mood preset to see it here</p>
              </div>
            ) : (
              presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    if (editMode) toggleCheck(preset.id);
                    else handleMoodSelect(preset.mood);
                  }}
                  disabled={!isSelectable && !editMode}
                  className={"bg-white rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm w-full text-left transition-all duration-150" + ((isSelectable || editMode) ? " active:scale-[0.98] active:bg-gray-50" : "")}
                >
                  <div className="w-12 h-12 rounded-2xl flex-shrink-0" style={{ background: "#f5ee9a" }} />
                  <div className="flex-1">
                    <p className="text-gray-900 font-semibold text-sm">{preset.mood}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{preset.styleName} · {preset.tags.slice(0, 2).join(", ")}</p>
                  </div>
                  {editMode ? (
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${checkedIds.includes(preset.id) ? "bg-blue-500 border-blue-500" : "border-gray-300"}`}>
                      {checkedIds.includes(preset.id) && (
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                  ) : isSelectable ? (
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="text-gray-300">
                      <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Edit mode bottom bar */}
      {editMode && (
        <div className="px-4 py-4 flex gap-3">
          <button
            onClick={handleCancel}
            className="flex-1 py-4 rounded-full border border-gray-200 bg-white text-gray-600 font-medium text-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            disabled={checkedIds.length === 0}
            className="flex-1 py-4 rounded-full bg-red-500 text-white font-semibold text-sm disabled:opacity-40"
          >
            {checkedIds.length > 0 ? `Delete (${checkedIds.length})` : "Delete"}
          </button>
        </div>
      )}
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense>
      <LibraryContent />
    </Suspense>
  );
}
