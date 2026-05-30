"use client";

import { useEffect, useState } from "react";

type GalleryImage = { id: number; src: string };

interface GalleryPickerProps {
  onSelect: (photo: GalleryImage) => void;
  onClose: () => void;
}

export default function GalleryPicker({ onSelect, onClose }: GalleryPickerProps) {
  const [photos, setPhotos] = useState<GalleryImage[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // 마운트 후 슬라이드 업 애니메이션
    requestAnimationFrame(() => setVisible(true));

    fetch("https://hci-null-production.up.railway.app/gallery")
      .then((res) => res.json())
      .then((data) => setPhotos(data.images ?? []))
      .catch(() => setPhotos([]));
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 280);
  };

  const handleChoose = () => {
    if (selected === null) return;
    const photo = photos.find((p) => p.id === selected);
    if (photo) {
      setVisible(false);
      setTimeout(() => onSelect(photo), 280);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end">
      {/* 배경 오버레이 */}
      <div
        className="absolute inset-0 bg-black/50 transition-opacity duration-280"
        style={{ opacity: visible ? 1 : 0 }}
        onClick={handleClose}
      />

      {/* Bottom sheet */}
      <div
        className="relative bg-white rounded-t-2xl flex flex-col transition-transform duration-280 ease-out"
        style={{
          transform: visible ? "translateY(0)" : "translateY(100%)",
          maxHeight: "80vh",
        }}
      >
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
          <button
            onClick={handleClose}
            className="text-blue-500 text-sm font-medium"
          >
            Cancel
          </button>
          <p className="text-gray-900 font-semibold text-sm">Recents</p>
          <button
            onClick={handleChoose}
            disabled={selected === null}
            className="text-blue-500 text-sm font-semibold disabled:opacity-30"
          >
            Choose
          </button>
        </div>

        {/* 사진 그리드 */}
        <div className="overflow-y-auto">
          <div className="grid grid-cols-3 gap-0.5">
            {photos.map((photo) => (
              <button
                key={photo.id}
                onClick={() => setSelected(photo.id)}
                className="relative aspect-square overflow-hidden"
              >
                <img
                  src={photo.src}
                  alt={`photo ${photo.id}`}
                  className="w-full h-full object-cover"
                />
                {selected === photo.id && (
                  <>
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-1.5 right-1.5 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
