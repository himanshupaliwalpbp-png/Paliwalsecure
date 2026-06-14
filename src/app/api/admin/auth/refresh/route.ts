import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken } from "@/lib/auth";

// ── Environment Variable Fallback Admin ────────────────────────────────────
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "";

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

    // ── Check if this is an env admin user ───────────────────────────────
    if (payload.userId === "env-admin-001" && ADMIN_EMAIL) {
      const accessToken = generateAccessToken({
        userId: "env-admin-001",
        email: ADMIN_EMAIL,
        role: "ADMIN",
      });

      return NextResponse.json({
        success: true,
        accessToken,
        user: {
          userId: "env-admin-001",
          email: ADMIN_EMAIL,
          role: "ADMIN",
          name: "Admin",
        },
      });
    }

    // ── Try database for non-env users ───────────────────────────────────
    let adminUser: { id: string; email: string; name: string; role: string; isActive: boolean } | null = null;

    try {
      const { db } = await import("@/lib/db");
      adminUser = await db.adminUser.findUnique({
        where: { id: payload.userId },
      });
    } catch {
      // Database unavailable
    }

    if (!adminUser || !adminUser.isActive) {
      return NextResponse.json(
        { success: false, error: "User not found or deactivated" },
        { status: 401 }
      );
    }

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
