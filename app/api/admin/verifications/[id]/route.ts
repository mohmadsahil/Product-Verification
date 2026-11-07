import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Verify } from "@/lib/models/Verify";
import { jsonWithCors, preflight, requireAdmin } from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauth = requireAdmin(req);
  if (unauth) return unauth;

  if (!/^[a-f0-9]{24}$/i.test(params.id)) {
    return jsonWithCors(req, { ok: false, error: "Invalid id" }, { status: 400 });
  }

  await dbConnect();
  const d = await Verify.findById(params.id).lean();
  if (!d) {
    return jsonWithCors(req, { ok: false, error: "Not found" }, { status: 404 });
  }

  return jsonWithCors(req, {
    ok: true,
    item: {
      id: String(d._id),
      name: d.name,
      email: d.email,
      mobile: d.mobile,
      boughtAt: d.boughtAt,
      product: d.product ?? null,
      ip: d.ip ?? null,
      userAgent: d.userAgent ?? null,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    },
  });
}
