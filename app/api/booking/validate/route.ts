import { NextResponse } from "next/server";
import { env, apiHeaders } from "../../../../lib/config/env";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const upstream = await fetch(env.endpoints.bookingValidate, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...apiHeaders() },
      body: JSON.stringify(payload),
      cache: "no-store",
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, message: `Upstream error ${upstream.status}` },
        { status: upstream.status }
      );
    }
    const data = await upstream.json();
    return NextResponse.json({ success: true, result: data?.result || data });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message || "Proxy failure" },
      { status: 500 }
    );
  }
}
