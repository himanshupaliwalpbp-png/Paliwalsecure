import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("admin_refresh_token")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { success: false, error: "No refresh token provided" },
        { status: 401 }
      );
    }

    // ── Verify refresh token ─────────────────────────────────────────────
    const payload = verifyRefreshToken(refreshToken);

    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid or expired refresh token" },
        { status: 401 }
      );
    }

    // ── Find user and check active ───────────────────────────────────────
    const adminUser = await db.adminUser.findUnique({
      where: { id: payload.userId },
    });

    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { success: false, error: "User not found or deactivated" },
        { status: 401 }
      );
    }

    // ── Generate new access token ────────────────────────────────────────
    const accessToken = generateAccessToken({
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    });

    return NextResponse.json({
      success: true,
      accessToken,
      user: {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
      },
    });
  } catch (error) {
    console.error("[REFRESH_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
