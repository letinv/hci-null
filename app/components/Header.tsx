"use client";

import { useRouter } from "next/navigation";

interface HeaderProps {
  title: string;
  onBack?: () => void;
}

const HomeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

export default function Header({ title, onBack }: HeaderProps) {
  const router = useRouter();

  return (
    <div className="px-4 pt-5 pb-2">
      <div className="bg-white rounded-full flex items-center px-2 py-2.5 shadow-sm">
        <button
          onClick={onBack ?? (() => router.back())}
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <span className="flex-1 text-center text-gray-800 font-semibold text-sm">
          {title}
        </span>
        <button
          onClick={() => router.push("/home")}
          className="w-9 h-9 flex items-center justify-center rounded-full flex-shrink-0 text-gray-500"
        >
          <HomeIcon />
        </button>
      </div>
    </div>
  );
}
