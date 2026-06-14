import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, verifyRefreshToken } from "@/lib/auth";

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
    // ── Identify user for audit log ──────────────────────────────────────
    let userId: string | null = null;

    const authHeader = request.headers.get("Authorization");
    if (authHeader?.startsWith("Bearer ")) {
      const payload = verifyAccessToken(authHeader.substring(7));
      if (payload) userId = payload.userId;
    }

    if (!userId) {
      const refreshToken = request.cookies.get("admin_refresh_token")?.value;
      if (refreshToken) {
        const payload = verifyRefreshToken(refreshToken);
        if (payload) userId = payload.userId;
      }
    }

    // ── Create audit log (best effort) ──────────────────────────────────
    if (userId) {
      const db = await getDb();
      if (db) {
        try {
          await db.auditLog.create({
            data: {
              action: "LOGOUT",
              entity: "AdminUser",
              entityId: userId,
              userId,
              userAgent: request.headers.get("user-agent"),
              ipAddress:
                request.headers.get("x-forwarded-for") ??
                request.headers.get("x-real-ip") ??
                "unknown",
            },
          });
        } catch {
          // Audit log failure shouldn't prevent logout
        }
      }
    }

    // ── Clear refresh token cookie ───────────────────────────────────────
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_refresh_token", "", {
      path: "/api/admin/auth/refresh",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });

    return response;
  } catch (error) {
    console.error("[LOGOUT_ERROR]", error);
    // Still clear cookie even if audit log fails
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_refresh_token", "", {
      path: "/api/admin/auth/refresh",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
    });
    return response;
  }
}
