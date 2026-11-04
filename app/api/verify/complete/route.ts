import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Verify } from "@/lib/models/Verify";
import { completeSchema } from "@/lib/validators";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = completeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Invalid input" },
        { status: 400 }
      );
    }
    const { id, product } = parsed.data;

    await dbConnect();
    const doc = await Verify.findByIdAndUpdate(
      id,
      { $set: { product } },
      { new: true }
    );
    if (!doc) {
      return NextResponse.json(
        { ok: false, error: "Session not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      ok: true,
      name: doc.name,
      product: doc.product,
      verifiedAt: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Something went wrong" },
      { status: 500 }
    );
  }
}
