import { db } from '@/lib/db';
import { NextRequest, NextResponse } from 'next/server';

// GET /api/insuranceos/clients - List clients with search
export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get('search') || '';
    const city = req.nextUrl.searchParams.get('city') || '';
    const state = req.nextUrl.searchParams.get('state') || '';

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { phone: { contains: search } },
        { email: { contains: search } },
      ];
    }

    if (city) {
      where.city = { contains: city };
    }

    if (state) {
      where.state = { contains: state };
    }

    const clients = await db.insuranceClient.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        policies: { select: { id: true, status: true, premium: true, insurer: true, category: true, odEndDate: true } },
        _count: { select: { policies: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ success: true, data: clients });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/insuranceos/clients - Create client
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, address, city, state, pincode } = body;

    if (!name || !phone) {
      return NextResponse.json(
        { success: false, error: 'Name and phone are required' },
        { status: 400 }
      );
    }

    const client = await db.insuranceClient.create({
      data: { name, phone, email, address, city, state, pincode },
    });

    return NextResponse.json({ success: true, data: client }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
