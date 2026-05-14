import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// ── CSV escaping helper ─────────────────────────────────────────────────────
function escapeCsvField(value: string | null | undefined): string {
  if (value === null || value === undefined) return "";
  const str = String(value);
  // If the field contains a comma, quote, or newline, wrap in quotes and escape internal quotes
  if (str.includes(",") || str.includes('"') || str.includes("\n") || str.includes("\r")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// ── GET /api/admin/leads/export — Export leads as CSV ──────────────────────
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const status = searchParams.get("status");
    const source = searchParams.get("source");

    // ── Build where clause ─────────────────────────────────────────────────
    const where: Record<string, unknown> = {};

    if (status) {
      where.status = status.toUpperCase();
    }
    if (source) {
      where.source = source.toLowerCase();
    }

    // ── Fetch leads ────────────────────────────────────────────────────────
    const leads = await db.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    // ── Build CSV ──────────────────────────────────────────────────────────
    const headers = [
      "Name",
      "Email",
      "Phone",
      "Insurance Type",
      "Status",
      "Source",
      "Message",
      "Follow Up Date",
      "Created At",
    ];

    const rows = leads.map((lead) =>
      [
        escapeCsvField(lead.name),
        escapeCsvField(lead.email),
        escapeCsvField(lead.phone),
        escapeCsvField(lead.insuranceType),
        escapeCsvField(lead.status),
        escapeCsvField(lead.source),
        escapeCsvField(lead.message),
        escapeCsvField(lead.followUpDate ? new Date(lead.followUpDate).toISOString() : ""),
        escapeCsvField(new Date(lead.createdAt).toISOString()),
      ].join(",")
    );

    const csv = [headers.join(","), ...rows].join("\n");

    // ── Return CSV response ────────────────────────────────────────────────
    const timestamp = new Date().toISOString().split("T")[0];
    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="leads-export-${timestamp}.csv"`,
      },
    });
  } catch (error) {
    console.error("[LEADS_EXPORT_ERROR]", error);
    return NextResponse.json(
      { success: false, error: "Failed to export leads" },
      { status: 500 }
    );
  }
}
