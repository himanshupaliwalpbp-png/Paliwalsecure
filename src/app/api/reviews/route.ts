import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import {
  VALID_INSURANCE_TYPES,
  VALID_REVIEW_STATUSES,
} from "@/lib/reviews/helpers";

// ── POST /api/reviews — Submit a new review (public) ─────────────────────
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      productName,
      insuranceType,
      rating,
      title,
      body: reviewBody,
      reviewerName,
      reviewerEmail,
      reviewerPhone,
      photoUrl,
    } = body;

    // ── Validate required fields ────────────────────────────────────────
    const missingFields: string[] = [];
    if (!productName) missingFields.push("productName");
    if (!insuranceType) missingFields.push("insuranceType");
    if (rating === undefined || rating === null) missingFields.push("rating");
    if (!title) missingFields.push("title");
    if (!reviewBody) missingFields.push("body");
    if (!reviewerName) missingFields.push("reviewerName");
    if (!reviewerEmail) missingFields.push("reviewerEmail");

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Missing required fields: ${missingFields.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── Validate insurance type ─────────────────────────────────────────
    if (!VALID_INSURANCE_TYPES.includes(insuranceType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid insuranceType. Must be one of: ${VALID_INSURANCE_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── Validate rating ─────────────────────────────────────────────────
    const ratingNum = Number(rating);
    if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be an integer between 1 and 5" },
        { status: 400 }
      );
    }

    // ── Validate title length ───────────────────────────────────────────
    if (title.length > 100) {
      return NextResponse.json(
        { success: false, error: "Title must be 100 characters or less" },
        { status: 400 }
      );
    }

    // ── Validate body length ────────────────────────────────────────────
    if (reviewBody.length > 2000) {
      return NextResponse.json(
        { success: false, error: "Body must be 2000 characters or less" },
        { status: 400 }
      );
    }

    // ── Validate email format ───────────────────────────────────────────
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(reviewerEmail)) {
      return NextResponse.json(
        { success: false, error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // ── Validate phone format if provided ───────────────────────────────
    if (reviewerPhone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(reviewerPhone.replace(/\D/g, ""))) {
        return NextResponse.json(
          {
            success: false,
            error: "Please provide a valid Indian phone number",
          },
          { status: 400 }
        );
      }
    }

    // ── Create review with pending status ───────────────────────────────
    const review = await db.review.create({
      data: {
        productName: productName.trim(),
        insuranceType,
        rating: ratingNum,
        title: title.trim(),
        body: reviewBody.trim(),
        reviewerName: reviewerName.trim(),
        reviewerEmail: reviewerEmail.trim().toLowerCase(),
        reviewerPhone: reviewerPhone?.trim() || null,
        photoUrl: photoUrl?.trim() || null,
        status: "pending",
      },
    });

    return NextResponse.json(
      { success: true, reviewId: review.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("[REVIEWS_POST_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// ── GET /api/reviews — List reviews (public) ─────────────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const insuranceType = searchParams.get("insuranceType");
    const status = searchParams.get("status") || "approved";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(
      50,
      Math.max(1, parseInt(searchParams.get("limit") || "10", 10))
    );

    // ── Validate status param ───────────────────────────────────────────
    if (!VALID_REVIEW_STATUSES.includes(status as typeof VALID_REVIEW_STATUSES[number])) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid status. Must be one of: ${VALID_REVIEW_STATUSES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── Build where clause ──────────────────────────────────────────────
    const where: Prisma.ReviewWhereInput = { status };

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

    // ── Get total count ─────────────────────────────────────────────────
    const total = await db.review.count({ where });

    // ── Get paginated reviews ───────────────────────────────────────────
    const reviews = await db.review.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        productName: true,
        insuranceType: true,
        rating: true,
        title: true,
        body: true,
        photoUrl: true,
        reviewerName: true,
        isVerifiedPurchase: true,
        helpfulYes: true,
        helpfulNo: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      reviews,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("[REVIEWS_GET_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
