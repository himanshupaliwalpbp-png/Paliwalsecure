import { NextRequest, NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { hashPassword } from "@/lib/auth";
import { apiRateLimiter, getClientIp } from "@/lib/server-rate-limiter";

// ── Owner Recovery — self-serve credential reset for the site owner ──────────
// The owner's admin account is FIXED to the registered owner email. A long
// recovery code (committed to this PRIVATE repo, overridable via env) gates
// the reset. Works both locally (SQLite) and on Vercel (Postgres/Neon).
const OWNER_EMAIL = "himanshupaliwalpbp@gmail.com";
const DEFAULT_RECOVERY_CODE = "3514fbc4d54ce42424bbba88ed25f498ba61ea6e74f8d114";
const RECOVERY_CODE = process.env.OWNER_RECOVERY_CODE || DEFAULT_RECOVERY_CODE;

function safeEqual(a: string, b: string): boolean {
  const A = Buffer.from(String(a));
  const B = Buffer.from(String(b));
  return A.length === B.length && timingSafeEqual(A, B);
}

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
    // ── Rate-limit: 5 attempts per IP per hour ────────────────────────────
    const ip = getClientIp(request);
    const rl = apiRateLimiter.check(`owner-recovery:${ip}`, 5, 3_600_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { success: false, error: "Too many recovery attempts. Try again later." },
        { status: 429 }
      );
    }

    const body = await request.json().catch(() => null);
    const { recoveryCode, newPassword } = body ?? {};

    if (!recoveryCode || !newPassword) {
      return NextResponse.json(
        { success: false, error: "Recovery code and new password are required." },
        { status: 400 }
      );
    }

    // ── Recovery code check (timing-safe) ─────────────────────────────────
    if (!safeEqual(String(recoveryCode).trim(), RECOVERY_CODE)) {
      return NextResponse.json(
        { success: false, error: "Invalid recovery code." },
        { status: 403 }
      );
    }

    // ── Strong password policy (same as setup) ────────────────────────────
    const password = String(newPassword);
    if (
      password.length < 12 ||
      !/[A-Z]/.test(password) ||
      !/[a-z]/.test(password) ||
      !/[0-9]/.test(password)
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Password must be at least 12 characters with uppercase, lowercase and numbers.",
        },
        { status: 400 }
      );
    }

    const db = await getDb();
    if (!db) {
      return NextResponse.json(
        { success: false, error: "Database not available on this deployment." },
        { status: 400 }
      );
    }

    // ── Upsert the owner's admin account ──────────────────────────────────
    const passwordHash = await hashPassword(password);
    const existing = await db.adminUser.findUnique({ where: { email: OWNER_EMAIL } });

    let userId: string;
    if (existing) {
      await db.adminUser.update({
        where: { id: existing.id },
        data: {
          passwordHash,
          isActive: true,
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
      userId = existing.id;
    } else {
      const created = await db.adminUser.create({
        data: {
          email: OWNER_EMAIL,
          name: "Himanshu Paliwal",
          passwordHash,
          role: "ADMIN",
          isActive: true,
        },
      });
      userId = created.id;
    }

    // ── Audit log ─────────────────────────────────────────────────────────
    await db.auditLog.create({
      data: {
        action: existing ? "UPDATE" : "CREATE",
        entity: "AdminUser",
        entityId: userId,
        details: JSON.stringify({
          email: OWNER_EMAIL,
          ownerRecovery: true,
        }),
        userId,
        userAgent: request.headers.get("user-agent"),
        ipAddress: ip,
      },
    });

    return NextResponse.json({ success: true, email: OWNER_EMAIL });
  } catch (error) {
    console.error("[OWNER_RECOVERY_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
