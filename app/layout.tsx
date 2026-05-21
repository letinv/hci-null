import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RePh",
  description: "Edit your photos by mood, not by parameters.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-screen bg-[#d0d0d0] flex items-center justify-center">
        {/* transform creates a new containing block so fixed children stay inside */}
        <div
          className="relative bg-white shadow-2xl overflow-hidden flex-shrink-0"
          style={{ width: "390px", height: "844px", transform: "translate(0, 0)" }}
        >
          <div className="h-full overflow-y-auto">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
