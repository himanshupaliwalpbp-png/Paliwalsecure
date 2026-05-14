import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, verifyAccessToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // ── Authenticate & authorize (ADMIN only) ────────────────────────────
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // Only ADMIN can create new users
    if (payload.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Forbidden: Only ADMIN can create users" },
        { status: 403 }
      );
    }

    // ── Parse input ──────────────────────────────────────────────────────
    const body = await request.json();
    const { name, email, password, role } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { success: false, error: "Name, email, and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    if (role && !["ADMIN", "MODERATOR"].includes(role)) {
      return NextResponse.json(
        { success: false, error: "Invalid role. Must be ADMIN or MODERATOR" },
        { status: 400 }
      );
    }

    // ── Check if email already exists ────────────────────────────────────
    const existingUser = await db.adminUser.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "A user with this email already exists" },
        { status: 409 }
      );
    }

    // ── Create user ──────────────────────────────────────────────────────
    const passwordHash = await hashPassword(password);
    const newUser = await db.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        role: role || "MODERATOR",
        isActive: true,
      },
    });

    // ── Audit log ────────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "CREATE",
        entity: "AdminUser",
        entityId: newUser.id,
        details: JSON.stringify({
          email: newUser.email,
          role: newUser.role,
          createdBy: payload.userId,
        }),
        userId: payload.userId,
        userAgent: request.headers.get("user-agent"),
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        userId: newUser.id,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("[CREATE_USER_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
