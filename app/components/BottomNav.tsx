"use client";

import { useRouter } from "next/navigation";

type NavId = "home" | "library" | "edit" | "style";

const navItems: { id: NavId; label: string; href: string; icon: React.ReactNode }[] = [
  {
    id: "home",
    label: "home",
    href: "/home",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
        <path d="M9 21V12h6v9" />
      </svg>
    ),
  },
  {
    id: "library",
    label: "library",
    href: "/library",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="18" rx="1" />
        <rect x="14" y="3" width="7" height="18" rx="1" />
      </svg>
    ),
  },
  {
    id: "edit",
    label: "edit",
    href: "/mood/select-photo",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
  {
    id: "style",
    label: "style",
    href: "/personal-style",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 20 9 12 16 4 9" />
        <polygon points="12 9 20 16 12 23 4 16" />
      </svg>
    ),
  },
];

export default function BottomNav({ active }: { active: NavId }) {
  const router = useRouter();

  return (
    <div
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[390px] flex items-center justify-around py-3 px-4 z-50"
      style={{ background: "#1c1c1e" }}
    >
      {navItems.map((item) => {
        const isActive = item.id === active;
        return (
          <button
            key={item.id}
            onClick={() => router.push(item.href)}
            className="flex flex-col items-center gap-1 py-1 px-3"
          >
            <span className={isActive ? "text-white" : "text-gray-500"}>
              {item.icon}
            </span>
            <span
              className={`text-[10px] font-medium ${
                isActive ? "text-white" : "text-gray-500"
              }`}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
