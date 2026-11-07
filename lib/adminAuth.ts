import { NextRequest, NextResponse } from "next/server";

const ADMIN_API_KEY = process.env.ADMIN_API_KEY || "";
const ADMIN_PANEL_ORIGINS = (process.env.ADMIN_PANEL_ORIGINS || "")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

function allowedOrigin(req: NextRequest): string {
  const origin = req.headers.get("origin") || "";
  if (ADMIN_PANEL_ORIGINS.includes("*")) return "*";
  if (origin && ADMIN_PANEL_ORIGINS.includes(origin)) return origin;
  return "";
}

export function corsHeaders(req: NextRequest): Record<string, string> {
  const origin = allowedOrigin(req);
  if (!origin) return {};
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers":
      "Authorization, X-Api-Key, Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

export function preflight(req: NextRequest) {
  return new NextResponse(null, { status: 204, headers: corsHeaders(req) });
}

export function requireAdmin(req: NextRequest): NextResponse | null {
  if (!ADMIN_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Admin API disabled (missing ADMIN_API_KEY)" },
      { status: 503, headers: corsHeaders(req) }
    );
  }
  const auth = req.headers.get("authorization") || "";
  const bearer = auth.toLowerCase().startsWith("bearer ")
    ? auth.slice(7).trim()
    : "";
  const keyHeader = req.headers.get("x-api-key") || "";
  const provided = bearer || keyHeader;
  if (!provided || provided !== ADMIN_API_KEY) {
    return NextResponse.json(
      { ok: false, error: "Unauthorized" },
      { status: 401, headers: corsHeaders(req) }
    );
  }
  return null;
}

export function jsonWithCors(
  req: NextRequest,
  data: unknown,
  init?: ResponseInit
) {
  const headers = {
    ...corsHeaders(req),
    ...(init?.headers as Record<string, string> | undefined),
  };
  return NextResponse.json(data, { ...init, headers });
}
