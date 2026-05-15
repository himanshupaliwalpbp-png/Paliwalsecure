import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/api-auth";

// ── PATCH /api/admin/content/glossary/[id] — Update glossary term ──────────
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
    const { term, hindiTerm, explanation, example, category, importance, status } = body;

    // ── Verify term exists ─────────────────────────────────────────────────
    const existing = await db.glossaryTerm.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Glossary term not found" },
        { status: 404 }
      );
    }

    // ── Build update data ──────────────────────────────────────────────────
    const updateData: Record<string, unknown> = { updatedBy: authUser.userId };
    const changes: string[] = [];

    if (term !== undefined) {
      updateData.term = term.trim();
      changes.push(`term: "${existing.term}" → "${term.trim()}"`);
    }
    if (hindiTerm !== undefined) {
      updateData.hindiTerm = hindiTerm?.trim() || null;
      changes.push("hindiTerm updated");
    }
    if (explanation !== undefined) {
      updateData.explanation = explanation.trim();
      changes.push("explanation updated");
    }
    if (example !== undefined) {
      updateData.example = example?.trim() || null;
      changes.push("example updated");
    }
    if (category !== undefined) {
      updateData.category = category.toLowerCase();
      changes.push(`category: ${existing.category} → ${category.toLowerCase()}`);
    }
    if (importance !== undefined) {
      updateData.importance = importance.toLowerCase();
      changes.push(`importance: ${existing.importance} → ${importance.toLowerCase()}`);
    }
    if (status !== undefined) {
      updateData.status = status.toLowerCase();
      changes.push(`status: ${existing.status} → ${status.toLowerCase()}`);
    }

    // ── Increment version on update ────────────────────────────────────────
    updateData.version = existing.version + 1;

    // ── Update term ────────────────────────────────────────────────────────
    const updated = await db.glossaryTerm.update({
      where: { id },
      data: updateData,
    });

    // ── Create AuditLog ────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "GlossaryTerm",
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
    console.error("[GLOSSARY_UPDATE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update glossary term" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/admin/content/glossary/[id] — Delete glossary term (ADMIN) ─
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

    // ── Verify term exists ─────────────────────────────────────────────────
    const existing = await db.glossaryTerm.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Glossary term not found" },
        { status: 404 }
      );
    }

    // ── Delete term ────────────────────────────────────────────────────────
    await db.glossaryTerm.delete({ where: { id } });

    // ── Create AuditLog ────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "DELETE",
        entity: "GlossaryTerm",
        entityId: id,
        details: JSON.stringify({
          term: existing.term,
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
    console.error("[GLOSSARY_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete glossary term" },
      { status: 500 }
    );
  }
}
