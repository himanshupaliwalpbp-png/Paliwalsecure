import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  getAdminFromRequest,
  VALID_INSURANCE_TYPES,
  VALID_REVIEW_STATUSES,
} from "@/lib/reviews/helpers";

// ── GET /api/admin/reviews — List reviews with admin filters ─────────────
export async function GET(request: NextRequest) {
  try {
    // ── Verify admin auth ───────────────────────────────────────────────
    const admin = getAdminFromRequest(request);
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const insuranceType = searchParams.get("insuranceType");
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit") || "20", 10))
    );
    const search = searchParams.get("search")?.trim();

    // ── Validate filters ────────────────────────────────────────────────
    if (status && !VALID_REVIEW_STATUSES.includes(status as typeof VALID_REVIEW_STATUSES[number])) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_REVIEW_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    if (
      insuranceType &&
      !VALID_INSURANCE_TYPES.includes(insuranceType as typeof VALID_INSURANCE_TYPES[number])
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid insuranceType. Must be one of: ${VALID_INSURANCE_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── Build where clause ──────────────────────────────────────────────
    const where: Prisma.ReviewWhereInput = {};

    if (status) where.status = status;
    if (insuranceType) where.insuranceType = insuranceType;

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { body: { contains: search } },
        { reviewerName: { contains: search } },
      ];
    }

    // ── Get total count ─────────────────────────────────────────────────
    const total = await db.review.count({ where });

    // ── Get paginated reviews with vote counts ──────────────────────────
    const reviews = await db.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      include: {
        votes: {
          select: {
            voteType: true,
            createdAt: true,
          },
        },
      },
    });

    return NextResponse.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[ADMIN_REVIEWS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
