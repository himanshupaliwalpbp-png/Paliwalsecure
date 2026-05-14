import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
} from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // ── Validate input ───────────────────────────────────────────────────
    if (!email || !password) {
      return NextResponse.json(
        { success: false, error: "Email and password are required" },
        { status: 400 }
      );
    }

    // ── Find admin user ──────────────────────────────────────────────────
    const adminUser = await db.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (!adminUser.isActive) {
      return NextResponse.json(
        { success: false, error: "Account is deactivated. Contact admin." },
        { status: 401 }
      );
    }

    // ── Compare password ─────────────────────────────────────────────────
    const isMatch = await comparePassword(password, adminUser.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // ── Generate tokens ──────────────────────────────────────────────────
    const tokenPayload = {
      userId: adminUser.id,
      email: adminUser.email,
      role: adminUser.role,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // ── Update last login ────────────────────────────────────────────────
    await db.adminUser.update({
      where: { id: adminUser.id },
      data: { lastLoginAt: new Date() },
    });

    // ── Create audit log ─────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "LOGIN",
        entity: "AdminUser",
        entityId: adminUser.id,
        details: JSON.stringify({ email: adminUser.email }),
        userId: adminUser.id,
        userAgent: request.headers.get("user-agent"),
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
      },
    });

    // ── Set refresh token as httpOnly cookie ─────────────────────────────
    const response = NextResponse.json({
      success: true,
      accessToken,
      user: {
        userId: adminUser.id,
        email: adminUser.email,
        role: adminUser.role,
        name: adminUser.name,
      },
    });

    response.cookies.set("admin_refresh_token", refreshToken, {
      path: "/api/admin/auth/refresh",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
    });

    return response;
  } catch (error) {
    console.error("[LOGIN_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
