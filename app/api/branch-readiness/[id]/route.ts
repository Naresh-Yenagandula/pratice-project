import { NextResponse } from 'next/server';
import { env, apiHeaders } from '../../../../lib/config/env';

// In newer Next.js versions dynamic route params may be a Promise.
export async function GET(request: Request, context: { params: Promise<{ id: string }> | { id: string } }) {
  const resolved = context.params instanceof Promise ? await context.params : context.params;
  const { id } = resolved;
  const urlObj = new URL(request.url);
  const isDeliverToMe = urlObj.searchParams.get('isDeliverToMe') === 'true';
  try {
    const upstream = await fetch(env.endpoints.branchReadiness(id, isDeliverToMe), { headers: apiHeaders(), cache: 'no-store' });
    if (!upstream.ok) {
      return NextResponse.json({ success: false, message: `Upstream error ${upstream.status}` }, { status: upstream.status });
    }
    const data = await upstream.json();
    return NextResponse.json({ success: true, result: data?.result || null });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message || 'Proxy failure' }, { status: 500 });
  }
}