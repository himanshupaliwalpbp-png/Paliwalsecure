import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser } from "@/lib/api-auth";

// ── GET /api/admin/content/articles — List articles ───────────────────────
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
        { title: { contains: search } },
        { slug: { contains: search } },
        { excerpt: { contains: search } },
        { author: { contains: search } },
        { category: { contains: search } },
      ];
    }

    // ── Count & fetch ──────────────────────────────────────────────────────
    const [total, articles] = await Promise.all([
      db.article.count({ where }),
      db.article.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    return NextResponse.json({
      success: true,
      data: articles,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[ARTICLES_LIST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch articles" },
      { status: 500 }
    );
  }
}

// ── POST /api/admin/content/articles — Create article ──────────────────────
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      excerpt,
      content,
      category,
      keyTakeaways,
      readTime,
      status,
      author,
      source,
      featuredImage,
    } = body;

    // ── Validate required fields ───────────────────────────────────────────
    if (!title || typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Title is required" },
        { status: 400 }
      );
    }
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }
    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 }
      );
    }

    // ── Check slug uniqueness ──────────────────────────────────────────────
    const existingSlug = await db.article.findUnique({ where: { slug: slug.trim() } });
    if (existingSlug) {
      return NextResponse.json(
        { success: false, error: "An article with this slug already exists" },
        { status: 409 }
      );
    }

    const articleStatus = status?.toLowerCase() || "draft";
    const isPublished = articleStatus === "published";

    // ── Create article ─────────────────────────────────────────────────────
    const article = await db.article.create({
      data: {
        title: title.trim(),
        slug: slug.trim(),
        excerpt: excerpt?.trim() || null,
        content: content.trim(),
        category: category?.toLowerCase() || "general",
        keyTakeaways: keyTakeaways
          ? typeof keyTakeaways === "string"
            ? keyTakeaways
            : JSON.stringify(keyTakeaways)
          : null,
        readTime: typeof readTime === "number" ? readTime : 5,
        status: articleStatus,
        featuredImage: featuredImage?.trim() || null,
        author: author?.trim() || null,
        source: source?.trim() || null,
        publishedAt: isPublished ? new Date() : null,
        createdBy: authUser.userId,
        updatedBy: authUser.userId,
      },
    });

    // ── Create AuditLog ────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "CREATE",
        entity: "Article",
        entityId: article.id,
        details: JSON.stringify({
          title: article.title,
          slug: article.slug,
          status: article.status,
          category: article.category,
        }),
        userId: authUser.userId,
        userAgent: request.headers.get("user-agent"),
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
      },
    });

    return NextResponse.json({ success: true, data: article }, { status: 201 });
  } catch (error) {
    console.error("[ARTICLE_CREATE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to create article" },
      { status: 500 }
    );
  }
}
