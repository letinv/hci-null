import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const res = await fetch("https://hci-null-production.up.railway.app/consistency-edit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const text = await res.text();

    if (!res.ok) {
      console.error("Railway error:", res.status, text);
      return NextResponse.json({ error: "backend error", detail: text }, { status: res.status });
    }

    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (err) {
    console.error("API route error:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
