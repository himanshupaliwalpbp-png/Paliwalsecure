import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, comparePassword, verifyAccessToken } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // ── Authenticate ─────────────────────────────────────────────────────
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if (!token) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyAccessToken(token);
    if (!payload) {
      return NextResponse.json({ success: false, error: "Invalid token" }, { status: 401 });
    }

    // ── Parse input ──────────────────────────────────────────────────────
    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { success: false, error: "New password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // ── Verify current password ──────────────────────────────────────────
    const user = await db.adminUser.findUnique({ where: { id: payload.userId } });
    if (!user) {
      return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
    }

    const isValid = await comparePassword(currentPassword, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // ── Update password ──────────────────────────────────────────────────
    const newPasswordHash = await hashPassword(newPassword);
    await db.adminUser.update({
      where: { id: user.id },
      data: { passwordHash: newPasswordHash },
    });

    // ── Audit log ────────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "UPDATE",
        entity: "AdminUser",
        entityId: user.id,
        details: JSON.stringify({ action: "password_changed" }),
        userId: user.id,
        userAgent: request.headers.get("user-agent"),
        ipAddress:
          request.headers.get("x-forwarded-for") ??
          request.headers.get("x-real-ip") ??
          "unknown",
      },
    });

    return NextResponse.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
