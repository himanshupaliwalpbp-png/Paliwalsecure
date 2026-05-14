import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// ── GET /api/admin/content/glossary — List glossary terms ──────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const category = searchParams.get("category");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));
    const search = searchParams.get("search")?.trim();

    // ── Build where clause ─────────────────────────────────────────────────
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status.toLowerCase();
    }
    if (category) {
      where.category = category.toLowerCase();
    }
    if (search) {
      where.OR = [
        { term: { contains: search } },
        { hindiTerm: { contains: search } },
        { explanation: { contains: search } },
        { category: { contains: search } },
      ];
    }

    // ── Count & fetch ──────────────────────────────────────────────────────
    const [total, terms] = await Promise.all([
      db.glossaryTerm.count({ where }),
      db.glossaryTerm.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: terms,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[GLOSSARY_LIST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch glossary terms" },
      { status: 500 }
    );
  }
}

// ── POST /api/admin/content/glossary — Create glossary term ────────────────
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { term, hindiTerm, explanation, example, category, importance, status } = body;

    // ── Validate required fields ───────────────────────────────────────────
    if (!term || typeof term !== "string" || term.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Term is required" },
        { status: 400 }
      );
    }
    if (!explanation || typeof explanation !== "string" || explanation.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Explanation is required" },
        { status: 400 }
      );
    }

    // ── Create glossary term ───────────────────────────────────────────────
    const glossaryTerm = await db.glossaryTerm.create({
      data: {
        term: term.trim(),
        hindiTerm: hindiTerm?.trim() || null,
        explanation: explanation.trim(),
        example: example?.trim() || null,
        category: category?.toLowerCase() || "general",
        importance: importance?.toLowerCase() || "medium",
        status: status?.toLowerCase() || "published",
        createdBy: authUser.userId,
        updatedBy: authUser.userId,
      },
    });

    // ── Create AuditLog ────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "CREATE",
        entity: "GlossaryTerm",
        entityId: glossaryTerm.id,
        details: JSON.stringify({
          term: glossaryTerm.term,
          category: glossaryTerm.category,
          status: glossaryTerm.status,
        }),
        userId: authUser.userId,
        userAgent: request.headers.get("user-agent"),
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
      },
    });

    return NextResponse.json({ success: true, data: glossaryTerm }, { status: 201 });
  } catch (error) {
    console.error("[GLOSSARY_CREATE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create glossary term" },
      { status: 500 }
    );
  }
}
