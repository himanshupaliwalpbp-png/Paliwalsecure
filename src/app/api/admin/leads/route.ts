import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ── GET /api/admin/leads — List leads with pagination, filtering, search ────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const source = searchParams.get("source");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search")?.trim();
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortDir = searchParams.get("sortDir") === "asc" ? "asc" : "desc";

    // ── Build where clause ─────────────────────────────────────────────────
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status.toUpperCase();
    }
    if (source) {
      where.source = source.toLowerCase();
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
        { message: { contains: search } },
      ];
    }

    // ── Validate sort field ────────────────────────────────────────────────
    const allowedSortFields = ["createdAt", "updatedAt", "name", "email", "status", "followUpDate"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    // ── Count & fetch ──────────────────────────────────────────────────────
    const [total, leads] = await Promise.all([
      db.lead.count({ where }),
      db.lead.findMany({
        where,
        include: {
          leadNotes: {
            orderBy: { createdAt: "desc" },
            include: {
              author: { select: { id: true, name: true, email: true } },
            },
          },
        },
        orderBy: { [sortField]: sortDir },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: leads,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[LEADS_LIST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}
