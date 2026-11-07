import { NextRequest } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import { Verify } from "@/lib/models/Verify";
import {
  corsHeaders,
  jsonWithCors,
  preflight,
  requireAdmin,
} from "@/lib/adminAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function OPTIONS(req: NextRequest) {
  return preflight(req);
}

export async function GET(req: NextRequest) {
  const unauth = requireAdmin(req);
  if (unauth) return unauth;

  const { searchParams } = new URL(req.url);

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limit = Math.min(
    200,
    Math.max(1, Number(searchParams.get("limit")) || 50)
  );
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const product = searchParams.get("product");

  const filter: Record<string, unknown> = {};
  if (product) filter.product = product;

  const createdAt: Record<string, Date> = {};
  if (from) {
    const d = new Date(from);
    if (!isNaN(d.getTime())) createdAt.$gte = d;
  }
  if (to) {
    const d = new Date(to);
    if (!isNaN(d.getTime())) createdAt.$lte = d;
  }
  if (Object.keys(createdAt).length) filter.createdAt = createdAt;

  await dbConnect();

  const [total, items] = await Promise.all([
    Verify.countDocuments(filter),
    Verify.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
  ]);

  const data = items.map((d) => ({
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
  }));

  return jsonWithCors(
    req,
    {
      ok: true,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      items: data,
    },
    { headers: corsHeaders(req) }
  );
}
