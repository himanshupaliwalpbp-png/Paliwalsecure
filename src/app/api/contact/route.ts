import { NextRequest, NextResponse } from 'next/server';

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

    // In production, you would send this data to:
    // 1. A database (e.g., Prisma + PostgreSQL)
    // 2. An email service (e.g., SendGrid, AWS SES)
    // 3. A CRM (e.g., HubSpot, Salesforce)
    //
    // Example email sending (commented out):
    // await sendEmail({
    //   to: 'your-email@example.com',
    //   subject: `New Insurance Inquiry from ${name}`,
    //   body: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\nInsurance Type: ${insuranceType}\nMessage: ${message}`,
    // });

    // Log the lead for now (replace with actual storage)
    console.log('New Lead Received:', {
      name,
      email,
      phone: phone || 'Not provided',
      insuranceType: insuranceType || 'Not specified',
      message,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      { 
        success: true, 
        message: 'Thank you for your inquiry! Our insurance advisor will contact you within 24 hours.' 
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
