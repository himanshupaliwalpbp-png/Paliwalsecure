import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { getAdminFromRequest } from "@/lib/reviews/helpers";

// ── PATCH /api/admin/reviews/[id] — Update a review (admin) ──────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── Verify admin auth ───────────────────────────────────────────────
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { id: reviewId } = await params;

    // ── Check review exists ─────────────────────────────────────────────
    const existingReview = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // ── Parse body ──────────────────────────────────────────────────────
    const body = await request.json();
    const { status, isVerifiedPurchase, adminNotes } = body;

    // ── Build update data ───────────────────────────────────────────────
    const updateData: Prisma.ReviewUpdateInput = {
      moderatedBy: admin.userId,
      moderatedAt: new Date(),
    };

    if (status !== undefined) {
      const validStatuses = ["pending", "approved", "rejected", "flagged"];
      if (!validStatuses.includes(status)) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid status. Must be one of: ${validStatuses.join(", ")}`,
          },
          { status: 400 }
        );
      }
      updateData.status = status;
    }

    if (isVerifiedPurchase !== undefined) {
      updateData.isVerifiedPurchase = Boolean(isVerifiedPurchase);
    }

    if (adminNotes !== undefined) {
      updateData.adminNotes = adminNotes;
    }

    // ── Update review ───────────────────────────────────────────────────
    const updatedReview = await db.review.update({
      where: { id: reviewId },
      data: updateData,
    });

    // ── Create audit log if status changed ──────────────────────────────
    if (status && status !== existingReview.status) {
      const actionMap: Record<string, string> = {
        approved: "APPROVE",
        rejected: "REJECT",
        flagged: "FLAG",
        pending: "UPDATE",
      };

      await db.auditLog.create({
        data: {
          action: actionMap[status] || "UPDATE",
          entity: "Review",
          entityId: reviewId,
          details: JSON.stringify({
            previousStatus: existingReview.status,
            newStatus: status,
            isVerifiedPurchase: updateData.isVerifiedPurchase,
            adminNotes: updateData.adminNotes,
          }),
          userId: admin.userId,
          userAgent: request.headers.get("user-agent"),
          ipAddress:
            request.headers.get("x-forwarded-for") ??
            request.headers.get("x-real-ip") ??
            "unknown",
        },
      });
    }

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    console.error("[ADMIN_REVIEW_PATCH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── DELETE /api/admin/reviews/[id] — Delete a review (admin only) ────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // ── Verify admin auth ───────────────────────────────────────────────
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ── Only ADMIN role can delete ──────────────────────────────────────
    if (admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only ADMIN role can delete reviews",
        },
        { status: 403 }
      );
    }

    const { id: reviewId } = await params;

    // ── Check review exists ─────────────────────────────────────────────
    const existingReview = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!existingReview) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // ── Create audit log before deletion ────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "DELETE",
        entity: "Review",
        entityId: reviewId,
        details: JSON.stringify({
          deletedReview: {
            productName: existingReview.productName,
            insuranceType: existingReview.insuranceType,
            rating: existingReview.rating,
            title: existingReview.title,
            reviewerName: existingReview.reviewerName,
            reviewerEmail: existingReview.reviewerEmail,
            status: existingReview.status,
          },
        }),
        userId: admin.userId,
        userAgent: request.headers.get("user-agent"),
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
      },
    });

    // ── Delete review (cascade deletes votes) ───────────────────────────
    await db.review.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[ADMIN_REVIEW_DELETE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
