import { NextRequest, NextResponse } from "next/server";

const GAS_URL = process.env.NEXT_PUBLIC_GAS_URL!;

export async function GET() {
  const res = await fetch(GAS_URL, { cache: "no-store" });
  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(GAS_URL, {
    method: "POST",
    body: JSON.stringify(body),
  });

  const text = await res.text();
  console.log("GASからの返答：", text);

  try {
    const data = JSON.parse(text);
    return NextResponse.json(data);
  } catch (e) {
    console.error("JSONパース失敗：", text);
    return NextResponse.json({ error: text }, { status: 500 });
  }
}