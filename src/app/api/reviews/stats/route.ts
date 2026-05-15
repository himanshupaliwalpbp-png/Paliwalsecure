import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { VALID_INSURANCE_TYPES } from "@/lib/reviews/helpers";

// ── GET /api/reviews/stats — Review aggregate stats (public) ─────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const insuranceType = searchParams.get("insuranceType");

    // ── Build where clause (only approved reviews) ──────────────────────
    const where: Prisma.ReviewWhereInput = { status: "approved" };

    if (insuranceType) {
      if (!VALID_INSURANCE_TYPES.includes(insuranceType as typeof VALID_INSURANCE_TYPES[number])) {
        return NextResponse.json(
          {
            success: false,
            error: `Invalid insuranceType. Must be one of: ${VALID_INSURANCE_TYPES.join(", ")}`,
          },
          { status: 400 }
        );
      }
      where.insuranceType = insuranceType;
    }

    // ── Get total reviews and average rating ────────────────────────────
    const aggregations = await db.review.aggregate({
      where,
      _count: true,
      _avg: { rating: true },
    });

    // ── Get verified count ──────────────────────────────────────────────
    const verifiedCount = await db.review.count({
      where: { ...where, isVerifiedPurchase: true },
    });

    // ── Get rating distribution ─────────────────────────────────────────
    const ratingGroups = await db.review.groupBy({
      by: ["rating"],
      where,
      _count: { rating: true },
    });

    // Build distribution object for ratings 1-5
    const ratingDistribution: Record<number, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };

    for (const group of ratingGroups) {
      if (group.rating >= 1 && group.rating <= 5) {
        ratingDistribution[group.rating] = group._count.rating;
      }
    }

    return NextResponse.json({
      averageRating: aggregations._avg.rating
        ? Math.round(aggregations._avg.rating * 10) / 10
        : 0,
      totalReviews: aggregations._count,
      ratingDistribution,
      verifiedCount,
    });
  } catch (error) {
    console.error("[REVIEWS_STATS_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
