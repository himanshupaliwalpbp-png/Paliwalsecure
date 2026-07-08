import { NextRequest, NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { apiRateLimiter, getClientIp } from "@/lib/server-rate-limiter";

async function getDb() {
  try {
    const dbModule = await import("@/lib/db");
    return dbModule.db;
  } catch {
    return null;
  }
}

// ── GET: Check if setup is needed (no admin users exist yet) ────────────────
// SECURITY: Always returns 404 once setup is done, to hide endpoint existence.
export async function GET(request: NextRequest) {
  try {
    // Rate-limit (per IP) to prevent setup-status probing
    const ip = getClientIp(request);
    const rl = apiRateLimiter.check(`setup-get:${ip}`, 5, 60_000); // 5/min
    if (!rl.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const db = await getDb();
    let setupRequired: boolean;

    if (db) {
      const existingAdminCount = await db.adminUser.count();
      setupRequired = existingAdminCount === 0;
    } else {
      // Database unavailable (Vercel serverless)
      setupRequired = !!(process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD_HASH) === false;
    }

    if (!setupRequired) {
      // Hide endpoint existence after setup is complete
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ setupRequired: true });
  } catch (error) {
    console.error("[SETUP_CHECK_ERROR]", error);
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // ── Rate-limit (per IP) to prevent brute-force / DB-empty probing ───────
    const ip = getClientIp(request);
    const rl = apiRateLimiter.check(`setup-post:${ip}`, 3, 60_000); // 3/min
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not available. Admin setup requires a database. On Vercel, use environment variables (ADMIN_EMAIL, ADMIN_PASSWORD_HASH) instead." },
        { status: 400 }
      );
    }

    // ── Check if any admin users already exist ───────────────────────────
    const existingAdminCount = await db.adminUser.count();

    if (existingAdminCount > 0) {
      // Hide endpoint existence — return 404 instead of 403
      return NextResponse.json(
        { success: false, error: "Not found" },
        { status: 404 }
      );
    }

    // ── Invite-code check (if ADMIN_SETUP_INVITE_CODE is set in env) ─────
    const inviteCode = process.env.ADMIN_SETUP_INVITE_CODE;
    if (inviteCode) {
      const body = await request.clone().json().catch(() => ({}));
      if (body.inviteCode !== inviteCode) {
        return NextResponse.json(
          { success: false, error: "Invalid or missing invite code" },
          { status: 403 }
        );
      }
    }

    // ── Parse and validate input ─────────────────────────────────────────
    const body = await request.json();
    const { email, name, password } = body;

    if (!email || !name || !password) {
      return NextResponse.json(
        { success: false, error: "Email, name, and password are required" },
        { status: 400 }
      );
    }

    // ── Strong password policy ───────────────────────────────────────────
    if (password.length < 12) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 12 characters" },
        { status: 400 }
      );
    }
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) {
      return NextResponse.json(
        { success: false, error: "Password must contain uppercase, lowercase, and numbers" },
        { status: 400 }
      );
    }

    // Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: "Invalid email format" },
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
