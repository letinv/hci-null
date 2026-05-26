"use client";

import Header from "../components/Header";

const SETTINGS = [
  { name: "Connected apps", info: "Instagram · Pinterest" },
  { name: "Style evolution", info: "Personal learning is ON" },
];

export default function SettingsPage() {
  return (
    <div className="min-h-full flex flex-col bg-[#f2f2f2]">
      <Header title="settings" />

      <div className="px-4 flex flex-col gap-5">
        <div>
          <p className="text-gray-400 text-[10px] font-semibold tracking-widest mb-3 px-1">
            ACCOUNT & SETTINGS
          </p>

          <div className="flex flex-col gap-2">
            {SETTINGS.map((item) => (
              <div
                key={item.name}
                className="bg-white rounded-2xl px-4 py-3 flex items-center gap-4 shadow-sm"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex-shrink-0"
                  style={{ background: "#f5ee9a" }}
                />
                <div>
                  <p className="text-gray-900 font-semibold text-sm">
                    {item.name}
                  </p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}