import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Verify } from "@/lib/models/Verify";
import { submitSchema } from "@/lib/validators";
import { clientIp, rateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = submitSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input" },
        { status: 400 }
      );
    }
    const ip = clientIp(req);
    const limit = rateLimit(`submit:${ip}`, 30, 10 * 60 * 1000);
    if (!limit.ok) {
      return NextResponse.json(
        { ok: false, error: "Too many requests" },
        { status: 429 }
      );
    }

    await dbConnect();
    const userAgent = req.headers.get("user-agent") || "";

    const doc = await Verify.create({
      ...parsed.data,
      ip,
      userAgent,
    });

    return NextResponse.json({ ok: true, id: String(doc._id) });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
