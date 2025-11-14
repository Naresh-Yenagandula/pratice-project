import { NextResponse } from "next/server";
import { env, apiHeaders } from "../../../../lib/config/env";

export async function GET() {
  try {
    const upstream = await fetch(env.endpoints.deliveryStates, {
      headers: apiHeaders(),
      cache: "no-store",
    });
    if (!upstream.ok) {
      return NextResponse.json(
        { success: false, message: `Upstream error ${upstream.status}` },
        { status: upstream.status }
      );
    }
    const data = await upstream.json();
    return NextResponse.json({ success: true, result: data?.result || [] });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, message: e.message || "Proxy failure" },
      { status: 500 }
    );
  }
}
