import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/api-auth";

// ── PATCH /api/admin/content/articles/[id] — Update article ────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    // ── Verify article exists ──────────────────────────────────────────────
    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    // ── Check slug uniqueness if changing ──────────────────────────────────
    if (slug && slug.trim() !== existing.slug) {
      const slugConflict = await db.article.findUnique({ where: { slug: slug.trim() } });
      if (slugConflict) {
        return NextResponse.json(
          { success: false, error: "An article with this slug already exists" },
          { status: 409 }
        );
      }
    }

    // ── Build update data ──────────────────────────────────────────────────
    const updateData: Record<string, unknown> = { updatedBy: authUser.userId };
    const changes: string[] = [];

    if (title !== undefined) {
      updateData.title = title.trim();
      changes.push("title updated");
    }
    if (slug !== undefined) {
      updateData.slug = slug.trim();
      changes.push("slug updated");
    }
    if (excerpt !== undefined) {
      updateData.excerpt = excerpt?.trim() || null;
      changes.push("excerpt updated");
    }
    if (content !== undefined) {
      updateData.content = content.trim();
      changes.push("content updated");
    }
    if (category !== undefined) {
      updateData.category = category.toLowerCase();
      changes.push(`category: ${existing.category} → ${category.toLowerCase()}`);
    }
    if (keyTakeaways !== undefined) {
      updateData.keyTakeaways =
        typeof keyTakeaways === "string" ? keyTakeaways : JSON.stringify(keyTakeaways);
      changes.push("keyTakeaways updated");
    }
    if (readTime !== undefined) {
      updateData.readTime = typeof readTime === "number" ? readTime : 5;
      changes.push("readTime updated");
    }
    if (author !== undefined) {
      updateData.author = author?.trim() || null;
      changes.push("author updated");
    }
    if (source !== undefined) {
      updateData.source = source?.trim() || null;
      changes.push("source updated");
    }
    if (featuredImage !== undefined) {
      updateData.featuredImage = featuredImage?.trim() || null;
      changes.push("featuredImage updated");
    }
    if (status !== undefined) {
      const newStatus = status.toLowerCase();
      updateData.status = newStatus;
      changes.push(`status: ${existing.status} → ${newStatus}`);

      // If status changed to "published" and publishedAt is null, set it
      if (newStatus === "published" && !existing.publishedAt) {
        updateData.publishedAt = new Date();
        changes.push("publishedAt set");
      }
    }

    // ── Increment version on update ────────────────────────────────────────
    updateData.version = existing.version + 1;

    // ── Update article ─────────────────────────────────────────────────────
    const updated = await db.article.update({
      where: { id },
      data: updateData,
    });

    // ── Create AuditLog ────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "Article",
        entityId: id,
        details: JSON.stringify({
          changes,
          version: updated.version,
        }),
        userId: authUser.userId,
        userAgent: request.headers.get("user-agent"),
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
      },
    });

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[ARTICLE_UPDATE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update article" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/admin/content/articles/[id] — Delete article (ADMIN only) ──
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const authUser = requireAdmin(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Forbidden: ADMIN role required" },
        { status: 403 }
      );
    }

    // ── Verify article exists ──────────────────────────────────────────────
    const existing = await db.article.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Article not found" },
        { status: 404 }
      );
    }

    // ── Delete article ─────────────────────────────────────────────────────
    await db.article.delete({ where: { id } });

    // ── Create AuditLog ────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "DELETE",
        entity: "Article",
        entityId: id,
        details: JSON.stringify({
          title: existing.title,
          slug: existing.slug,
          category: existing.category,
        }),
        userId: authUser.userId,
        userAgent: request.headers.get("user-agent"),
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ARTICLE_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete article" },
      { status: 500 }
    );
  }
}
