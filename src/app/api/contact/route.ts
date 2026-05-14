import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, message, insuranceType } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    // Validate phone format (Indian) if provided
    if (phone) {
      const phoneRegex = /^[6-9]\d{9}$/;
      if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
        return NextResponse.json(
          { error: 'Please provide a valid Indian phone number.' },
          { status: 400 }
        );
      }
    }

    // Save lead to database
    const lead = await db.lead.create({
      data: {
        name,
        email,
        phone: phone || null,
        message,
        insuranceType: insuranceType || null,
        status: 'NEW',
        source: 'website',
      },
    });

    // Also create an audit log entry
    await db.auditLog.create({
      data: {
        action: 'CREATE',
        entity: 'Lead',
        entityId: lead.id,
        details: JSON.stringify({
          name,
          email,
          insuranceType: insuranceType || 'Not specified',
          source: 'website',
        }),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your inquiry! Our insurance advisor will contact you within 24 hours.',
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}
