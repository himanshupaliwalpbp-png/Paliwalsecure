import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/insuranceos/policies - List all policies with search & filters
export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search') || '';
    const category = req.nextUrl.searchParams.get('category') || '';
    const status = req.nextUrl.searchParams.get('status') || '';
    const insurer = req.nextUrl.searchParams.get('insurer') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { policyNo: { contains: search } },
        { insurer: { contains: search } },
        { vehicleModel: { contains: search } },
        { registrationNo: { contains: search } },
        { client: { name: { contains: search } } },
      ];
    }

    if (category) {
      where.category = category;
    }

    if (status) {
      where.status = status;
    }

    if (insurer) {
      where.insurer = { contains: insurer };
    }

    const policies = await db.insurancePolicy.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        client: { select: { id: true, name: true, phone: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: policies });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/insuranceos/policies - Create new policy
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientId,
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
      status,
      ncbPercent,
      documentUrl,
      notes,
      sumInsured,
    } = body;

    if (!clientId || !policyNo || !insurer || premium === undefined) {
      return NextResponse.json(
        { success: false, error: 'clientId, policyNo, insurer, and premium are required' },
        { status: 400 }
      );
    }

    // Verify client exists
    const clientExists = await db.insuranceClient.findUnique({ where: { id: clientId } });
    if (!clientExists) {
      return NextResponse.json(
        { success: false, error: 'Client not found' },
        { status: 404 }
      );
    }

    const policy = await db.insurancePolicy.create({
      data: {
        clientId,
        vehicleMake,
        vehicleModel,
        vehicleYear,
        registrationNo,
        fuelType,
        engineNo,
        chassisNo,
        policyNo,
        insurer,
        policyType: policyType || 'COMPREHENSIVE',
        category: category || 'motor',
        idv,
        premium,
        gst,
        totalPremium,
        odStartDate: odStartDate ? new Date(odStartDate) : null,
        odEndDate: odEndDate ? new Date(odEndDate) : null,
        tpStartDate: tpStartDate ? new Date(tpStartDate) : null,
        tpEndDate: tpEndDate ? new Date(tpEndDate) : null,
        addOns: addOns ? JSON.stringify(addOns) : null,
        auditReport: auditReport ? (typeof auditReport === 'string' ? auditReport : JSON.stringify(auditReport)) : null,
        healthScore,
        status: status || 'ACTIVE',
        ncbPercent: ncbPercent || 0,
        documentUrl,
        notes,
        sumInsured,
      },
      include: {
        client: { select: { id: true, name: true, phone: true } },
      },
    });

    return NextResponse.json({ success: true, data: policy }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
