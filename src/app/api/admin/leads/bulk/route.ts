import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAuthUser, requireAdmin } from "@/lib/api-auth";

// ── POST /api/admin/leads/bulk — Bulk lead actions ────────────────────────
export async function POST(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { leadIds, action } = body as {
      leadIds: string[];
      action: "contacted" | "qualified" | "converted" | "lost" | "delete";
    };

    // ── Validate input ─────────────────────────────────────────────────────
    if (!Array.isArray(leadIds) || leadIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "leadIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const validActions = ["contacted", "qualified", "converted", "lost", "delete"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { success: false, error: `Invalid action. Must be one of: ${validActions.join(", ")}` },
        { status: 400 }
      );
    }

    // ── ADMIN check for delete ─────────────────────────────────────────────
    if (action === "delete") {
      const adminUser = requireAdmin(request);
      if (!adminUser) {
        return NextResponse.json(
          { success: false, error: "Forbidden: ADMIN role required for delete" },
          { status: 403 }
        );
      }
    }

    let affected = 0;

    if (action === "delete") {
      // ── Bulk delete ──────────────────────────────────────────────────────
      const leads = await db.lead.findMany({
        where: { id: { in: leadIds } },
        select: { id: true, name: true, email: true, status: true },
      });

      const result = await db.lead.deleteMany({
        where: { id: { in: leadIds } },
      });
      affected = result.count;

      // ── Create AuditLog for bulk delete ──────────────────────────────────
      await db.auditLog.create({
        data: {
          action: "DELETE",
          entity: "Lead",
          details: JSON.stringify({
            bulkAction: "delete",
            count: affected,
            leads: leads.map((l) => ({ id: l.id, name: l.name, email: l.email })),
          }),
          userId: authUser.userId,
          userAgent: request.headers.get("user-agent"),
          ipAddress:
            request.headers.get("x-forwarded-for") ??
            request.headers.get("x-real-ip") ??
            "unknown",
        },
      });
    } else {
      // ── Bulk status update ───────────────────────────────────────────────
      const statusMap: Record<string, string> = {
        contacted: "CONTACTED",
        qualified: "QUALIFIED",
        converted: "CONVERTED",
        lost: "LOST",
      };

      const newStatus = statusMap[action];
      const updateData: { status: string; lastContactedAt?: Date } = { status: newStatus };

      // Set lastContactedAt for CONTACTED
      if (action === "contacted") {
        updateData.lastContactedAt = new Date();
      }

      const result = await db.lead.updateMany({
        where: { id: { in: leadIds } },
        data: updateData,
      });
      affected = result.count;

      // ── Create AuditLog for bulk update ──────────────────────────────────
      await db.auditLog.create({
        data: {
          action: "UPDATE",
          entity: "Lead",
          details: JSON.stringify({
            bulkAction: action,
            newStatus,
            count: affected,
            leadIds,
          }),
          userId: authUser.userId,
          userAgent: request.headers.get("user-agent"),
          ipAddress:
            request.headers.get("x-forwarded-for") ??
            request.headers.get("x-real-ip") ??
            "unknown",
        },
      });
    }

    return NextResponse.json({ success: true, affected });
  } catch (error) {
    console.error("[LEADS_BULK_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to perform bulk action" },
      { status: 500 }
    );
  }
}
