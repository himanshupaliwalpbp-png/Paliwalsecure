import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/insuranceos/policies/[id] - Get single policy with client + audit report
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const policy = await db.insurancePolicy.findUnique({
      where: { id },
      include: {
        client: { select: { id: true, name: true, phone: true, email: true, address: true, city: true, state: true } },
        renewalReminders: { orderBy: { createdAt: 'desc' } },
      },
    });

    if (!policy) {
      return NextResponse.json(
        { success: false, error: 'Policy not found' },
        { status: 404 }
      );
    }

    // Parse audit report JSON if present
    let parsedAuditReport = null;
    if (policy.auditReport) {
      try {
        parsedAuditReport = JSON.parse(policy.auditReport);
      } catch {
        parsedAuditReport = policy.auditReport;
      }
    }

    // Parse addOns JSON if present
    let parsedAddOns = null;
    if (policy.addOns) {
      try {
        parsedAddOns = JSON.parse(policy.addOns);
      } catch {
        parsedAddOns = policy.addOns;
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...policy,
        auditReport: parsedAuditReport,
        addOns: parsedAddOns,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// PUT /api/insuranceos/policies/[id] - Update policy
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();

    const existing = await db.insurancePolicy.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Policy not found' },
        { status: 404 }
      );
    }

    const {
      vehicleMake,
      vehicleModel,
      vehicleYear,
      registrationNo,
      fuelType,
      engineNo,
      chassisNo,
      policyNo,
      insurer,
      policyType,
      category,
      idv,
      premium,
      gst,
      totalPremium,
      odStartDate,
      odEndDate,
      tpStartDate,
      tpEndDate,
      addOns,
      auditReport,
      healthScore,
      auditedAt,
      status,
      ncbPercent,
      documentUrl,
      notes,
      sumInsured,
    } = body;

    const updateData: any = {};

    // Only update fields that are provided
    if (vehicleMake !== undefined) updateData.vehicleMake = vehicleMake;
    if (vehicleModel !== undefined) updateData.vehicleModel = vehicleModel;
    if (vehicleYear !== undefined) updateData.vehicleYear = vehicleYear;
    if (registrationNo !== undefined) updateData.registrationNo = registrationNo;
    if (fuelType !== undefined) updateData.fuelType = fuelType;
    if (engineNo !== undefined) updateData.engineNo = engineNo;
    if (chassisNo !== undefined) updateData.chassisNo = chassisNo;
    if (policyNo !== undefined) updateData.policyNo = policyNo;
    if (insurer !== undefined) updateData.insurer = insurer;
    if (policyType !== undefined) updateData.policyType = policyType;
    if (category !== undefined) updateData.category = category;
    if (idv !== undefined) updateData.idv = idv;
    if (premium !== undefined) updateData.premium = premium;
    if (gst !== undefined) updateData.gst = gst;
    if (totalPremium !== undefined) updateData.totalPremium = totalPremium;
    if (odStartDate !== undefined) updateData.odStartDate = odStartDate ? new Date(odStartDate) : null;
    if (odEndDate !== undefined) updateData.odEndDate = odEndDate ? new Date(odEndDate) : null;
    if (tpStartDate !== undefined) updateData.tpStartDate = tpStartDate ? new Date(tpStartDate) : null;
    if (tpEndDate !== undefined) updateData.tpEndDate = tpEndDate ? new Date(tpEndDate) : null;
    if (addOns !== undefined) updateData.addOns = typeof addOns === 'string' ? addOns : JSON.stringify(addOns);
    if (auditReport !== undefined) updateData.auditReport = typeof auditReport === 'string' ? auditReport : JSON.stringify(auditReport);
    if (healthScore !== undefined) updateData.healthScore = healthScore;
    if (auditedAt !== undefined) updateData.auditedAt = auditedAt ? new Date(auditedAt) : null;
    if (status !== undefined) updateData.status = status;
    if (ncbPercent !== undefined) updateData.ncbPercent = ncbPercent;
    if (documentUrl !== undefined) updateData.documentUrl = documentUrl;
    if (notes !== undefined) updateData.notes = notes;
    if (sumInsured !== undefined) updateData.sumInsured = sumInsured;

    const policy = await db.insurancePolicy.update({
      where: { id },
      data: updateData,
      include: {
        client: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json({ success: true, data: policy });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// DELETE /api/insuranceos/policies/[id] - Delete policy
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await db.insurancePolicy.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Policy not found' },
        { status: 404 }
      );
    }

    await db.insurancePolicy.delete({ where: { id } });

    return NextResponse.json({ success: true, data: { message: 'Policy deleted successfully' } });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
