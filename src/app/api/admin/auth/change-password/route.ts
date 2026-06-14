import { NextRequest, NextResponse } from "next/server";
import { hashPassword, comparePassword, verifyAccessToken } from "@/lib/auth";

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

async function getDb() {
  try {
    const dbModule = await import("@/lib/db");
    return dbModule.db;
  } catch {
    return null;
  }
}

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

    const db = await getDb();

    // ── Database available (local dev) ─────────────────────────────────────
    if (db) {
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

      const newPasswordHash = await hashPassword(newPassword);
      await db.adminUser.update({
        where: { id: user.id },
        data: { passwordHash: newPasswordHash },
      });

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
    }

    // ── No database (Vercel/serverless) ──────────────────────────────────
    if (payload.userId === "env-admin-001") {
      if (!ADMIN_PASSWORD_HASH) {
        return NextResponse.json(
          { success: false, error: "Cannot change password. Update the ADMIN_PASSWORD_HASH environment variable on Vercel instead." },
          { status: 400 }
        );
      }

      const isValid = await comparePassword(currentPassword, ADMIN_PASSWORD_HASH);
      if (!isValid) {
        return NextResponse.json(
          { success: false, error: "Current password is incorrect" },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "On Vercel, please update the ADMIN_PASSWORD_HASH environment variable in your Vercel project settings to change your password.",
        isEnvSetup: true,
      });
    }

    return NextResponse.json(
      { success: false, error: "User not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("[CHANGE_PASSWORD_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
