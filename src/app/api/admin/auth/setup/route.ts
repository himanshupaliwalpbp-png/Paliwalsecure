import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    // ── Check if any admin users already exist ───────────────────────────
    const existingAdminCount = await db.adminUser.count();

    if (existingAdminCount > 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Setup already completed. Admin users exist.",
        },
        { status: 403 }
      );
    }

    // ── Parse and validate input ─────────────────────────────────────────
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email, name, and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 8 characters",
        },
        { status: 400 }
      );
    }

    // ── Create first ADMIN user ──────────────────────────────────────────
    const passwordHash = await hashPassword(password);

    const adminUser = await db.adminUser.create({
      data: {
        email: email.toLowerCase().trim(),
        name: name.trim(),
        passwordHash,
        role: "ADMIN",
        isActive: true,
      },
    });

    // ── Create audit log ─────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: "CREATE",
        entity: "AdminUser",
        entityId: adminUser.id,
        details: JSON.stringify({
          email: adminUser.email,
          role: adminUser.role,
          setupInit: true,
        }),
        userId: adminUser.id,
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
        userId: adminUser.id,
        email: adminUser.email,
        name: adminUser.name,
        role: adminUser.role,
      },
    });
  } catch (error) {
    console.error("[SETUP_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
