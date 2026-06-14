import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  generateVoterFingerprint,
  VALID_VOTE_TYPES,
} from "@/lib/reviews/helpers";

// ── POST /api/reviews/[id]/vote — Vote helpful/not_helpful (public) ──────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: reviewId } = await params;

    // ── Check review exists ─────────────────────────────────────────────
    const review = await db.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      return NextResponse.json(
        { success: false, error: "Review not found" },
        { status: 404 }
      );
    }

    // ── Only allow voting on approved reviews ───────────────────────────
    if (review.status !== "approved") {
      return NextResponse.json(
        { success: false, error: "Cannot vote on this review" },
        { status: 400 }
      );
    }

    // ── Parse and validate body ─────────────────────────────────────────
    const body = await request.json();
    const { voteType } = body;

    if (!voteType || !VALID_VOTE_TYPES.includes(voteType)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid voteType. Must be one of: ${VALID_VOTE_TYPES.join(", ")}`,
        },
        { status: 400 }
      );
    }

    // ── Generate voter fingerprint ──────────────────────────────────────
    const voterFingerprint = generateVoterFingerprint(request);

    // ── Check if already voted ──────────────────────────────────────────
    const existingVote = await db.reviewVote.findUnique({
      where: {
        reviewId_voterFingerprint: {
          reviewId,
          voterFingerprint,
        },
      },
    });

    if (existingVote) {
      return NextResponse.json(
        { success: false, error: "You have already voted on this review" },
        { status: 409 }
      );
    }

    // ── Create vote and update counter in transaction ───────────────────
    await db.$transaction([
      db.reviewVote.create({
        data: {
          reviewId,
          voterFingerprint,
          voteType,
        },
      }),
      db.review.update({
        where: { id: reviewId },
        data: {
          helpfulYes: voteType === "helpful" ? { increment: 1 } : undefined,
          helpfulNo:
            voteType === "not_helpful" ? { increment: 1 } : undefined,
        },
      }),
    ]);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[REVIEW_VOTE_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
