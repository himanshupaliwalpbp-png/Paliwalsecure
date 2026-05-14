import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/api-auth";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const authUser = getAuthUser(request);
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: "Authentication required" },
        { status: 401 }
      );
    }

    const adminUser = await db.adminUser.findUnique({
      where: { id: authUser.userId },
      select: { mfaEnabled: true, totpSecret: true },
    });

    if (!adminUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      mfaEnabled: adminUser.mfaEnabled,
      totpSecret: adminUser.totpSecret ? "exists" : null, // Don't expose the actual secret
    });
  } catch (error) {
    console.error("[MFA_STATUS_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
