import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/api-auth";

// ── PATCH /api/admin/leads/[id] — Update a lead ───────────────────────────
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
    const { status, followUpDate, assignedTo, notes } = body;

    // ── Verify lead exists ─────────────────────────────────────────────────
    const existing = await db.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    // ── Build update data ──────────────────────────────────────────────────
    const updateData: Record<string, unknown> = {};
    const changes: string[] = [];

    if (status !== undefined) {
      const upperStatus = status.toUpperCase();
      updateData.status = upperStatus;
      if (upperStatus !== existing.status) {
        changes.push(`status: ${existing.status} → ${upperStatus}`);
        // Set lastContactedAt when status changes to CONTACTED
        if (upperStatus === "CONTACTED") {
          updateData.lastContactedAt = new Date();
        }
      }
    }
    if (followUpDate !== undefined) {
      updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
      changes.push(`followUpDate updated`);
    }
    if (assignedTo !== undefined) {
      updateData.assignedTo = assignedTo;
      changes.push(`assignedTo: ${existing.assignedTo || "none"} → ${assignedTo || "none"}`);
    }
    if (notes !== undefined) {
      updateData.notes = notes;
      changes.push("notes updated");
    }

    // ── Update lead ────────────────────────────────────────────────────────
    const updated = await db.lead.update({
      where: { id },
      data: updateData,
      include: {
        leadNotes: {
          orderBy: { createdAt: "desc" },
          include: {
            author: { select: { id: true, name: true, email: true } },
          },
        },
      },
    });

    // ── Create AuditLog if status changed ──────────────────────────────────
    if (changes.length > 0) {
      await db.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Lead",
          entityId: id,
          details: JSON.stringify({ changes }),
          userId: authUser.userId,
          userAgent: request.headers.get("user-agent"),
          ipAddress:
            request.headers.get("x-forwarded-for") ??
            request.headers.get("x-real-ip") ??
            "unknown",
        },
      });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error("[LEAD_UPDATE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to update lead" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/admin/leads/[id] — Delete a lead (ADMIN only) ──────────────
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

    // ── Verify lead exists ─────────────────────────────────────────────────
    const existing = await db.lead.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ success: false, error: "Lead not found" }, { status: 404 });
    }

    // ── Delete lead (cascades to LeadNote) ─────────────────────────────────
    await db.lead.delete({ where: { id } });

    // ── Create AuditLog ────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "DELETE",
        entity: "Lead",
        entityId: id,
        details: JSON.stringify({
          name: existing.name,
          email: existing.email,
          status: existing.status,
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
    console.error("[LEAD_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete lead" },
      { status: 500 }
    );
  }
}
