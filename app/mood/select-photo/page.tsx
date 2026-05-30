"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "../../components/Header";

type GalleryImage = { id: number; src: string };

function SelectPhotoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<number | null>(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/gallery")
      .then((res) => res.json())
      .then((data) => setPhotos(data.images ?? []))
      .catch(() => setPhotos([]));
  }, []);

  const handleNext = () => {
    if (selected !== null) {
      const photo = photos.find((p) => p.id === selected);
      if (photo) {
        localStorage.setItem("selectedMoodPhoto", JSON.stringify(photo));
        if (from === "personal-style") {
          router.push("/personal-style");
        } else {
          router.push("/mood/input");
        }
      }
    }
  };

  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="target photo selection" />

      <p className="px-5 pt-1 pb-3 text-gray-500 text-sm">
        Choose one photo from your album.
      </p>

      {/* Photo grid card */}
      <div className="mx-4 bg-white rounded-2xl p-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="font-bold text-gray-900 text-base">Recents</p>
            <p className="text-gray-400 text-xs">{photos.length} items</p>
          </div>
          <button className="text-blue-500 text-sm font-medium">All Photos</button>
        </div>

        <div className="grid grid-cols-3 gap-1.5">
          {photos.map((photo) => (
            <button
              key={photo.id}
              onClick={() => setSelected(photo.id)}
              className="relative aspect-square rounded-xl overflow-hidden"
            >
              <img
                src={photo.src}
                alt={`photo ${photo.id}`}
                className="w-full h-full object-cover"
              />
              {selected === photo.id && (
                <>
                  <div className="absolute inset-0 border-[3px] border-blue-500 rounded-xl" />
                  <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="px-5 py-4 flex flex-col items-center gap-2">
        <p className="text-gray-400 text-sm">
          {selected !== null ? "Selected 1 photo" : "No photo selected"}
        </p>
        <button
          onClick={handleNext}
          disabled={selected === null}
          className="w-full py-4 rounded-full text-gray-800 font-semibold text-sm disabled:opacity-40"
          style={{ background: "#f2c8d4" }}
        >
          Select / Next →
        </button>
      </div>
    </div>
  );
}

export default function SelectPhotoPage() {
  return (
    <Suspense>
      <SelectPhotoContent />
    </Suspense>
  );
}
