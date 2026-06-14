import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminFromRequest, VALID_BULK_ACTIONS } from "@/lib/reviews/helpers";

// ── POST /api/admin/reviews/bulk — Bulk actions on reviews (admin) ───────
export async function POST(request: NextRequest) {
  try {
    // ── Verify admin auth ───────────────────────────────────────────────
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    // ── Parse body ──────────────────────────────────────────────────────
    const body = await request.json();
    const { reviewIds, action } = body;

    // ── Validate reviewIds ──────────────────────────────────────────────
    if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
      return NextResponse.json(
        { success: false, error: "reviewIds must be a non-empty array" },
        { status: 400 }
      );
    }

    // ── Validate action ─────────────────────────────────────────────────
    if (!action || !VALID_BULK_ACTIONS.includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid action. Must be one of: ${VALID_BULK_ACTIONS.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── Only ADMIN role can delete ──────────────────────────────────────
    if (action === "delete" && admin.role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: "Forbidden: Only ADMIN role can delete reviews",
        },
        { status: 403 }
      );
    }

    // ── Map action to status update ─────────────────────────────────────
    const actionToStatus: Record<string, string> = {
      approve: "approved",
      reject: "rejected",
      flag: "flagged",
    };

    const ipAddress =
      request.headers.get("x-forwarded-for") ??
      request.headers.get("x-real-ip") ??
      "unknown";
    const userAgent = request.headers.get("user-agent");

    if (action === "delete") {
      // ── Delete: fetch reviews, create audit logs, then delete ─────────
      const reviewsToDelete = await db.review.findMany({
        where: { id: { in: reviewIds } },
        select: {
          id: true,
          productName: true,
          insuranceType: true,
          rating: true,
          title: true,
          reviewerName: true,
          status: true,
        },
      });

      // Create audit logs for each review
      await db.auditLog.createMany({
        data: reviewsToDelete.map((review) => ({
          action: "DELETE",
          entity: "Review",
          entityId: review.id,
          details: JSON.stringify({
            bulkAction: true,
            deletedReview: {
              productName: review.productName,
              insuranceType: review.insuranceType,
              rating: review.rating,
              title: review.title,
              reviewerName: review.reviewerName,
              status: review.status,
            },
          }),
          userId: admin.userId,
          userAgent,
          ipAddress,
        })),
      });

      // Delete reviews (cascade deletes votes)
      const result = await db.review.deleteMany({
        where: { id: { in: reviewIds } },
      });

      return NextResponse.json({
        success: true,
        affected: result.count,
      });
    } else {
      // ── Status update: approve / reject / flag ────────────────────────
      const newStatus = actionToStatus[action];
      const actionLogMap: Record<string, string> = {
        approve: "APPROVE",
        reject: "REJECT",
        flag: "FLAG",
      };

      // Fetch existing reviews for audit logging
      const existingReviews = await db.review.findMany({
        where: { id: { in: reviewIds } },
        select: { id: true, status: true },
      });

      // Update all matching reviews
      const result = await db.review.updateMany({
        where: { id: { in: reviewIds } },
        data: {
          status: newStatus,
          moderatedBy: admin.userId,
          moderatedAt: new Date(),
        },
      });

      // Create audit logs for each review that was actually updated
      const updatedReviewIds = existingReviews
        .filter((r) => r.status !== newStatus)
        .map((r) => r.id);

      if (updatedReviewIds.length > 0) {
        await db.auditLog.createMany({
          data: updatedReviewIds.map((reviewId) => ({
            action: actionLogMap[action],
            entity: "Review",
            entityId: reviewId,
            details: JSON.stringify({
              bulkAction: true,
              newStatus,
            }),
            userId: admin.userId,
            userAgent,
            ipAddress,
          })),
        });
      }

      return NextResponse.json({
        success: true,
        affected: result.count,
      });
    }
  } catch (error) {
    console.error("[ADMIN_REVIEWS_BULK_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
