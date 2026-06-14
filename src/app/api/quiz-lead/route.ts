import { NextRequest, NextResponse } from 'next/server';

// Simple in-memory storage for quiz leads (since we don't want to modify prisma schema)
// In production, you'd use a proper database table
const quizLeads: Array<{
  name: string;
  city: string;
  interest: string;
  score: number;
  mode: string;
  quizCode: string;
  date: string;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, city, interest, score, mode, quizCode } = body;

    if (!name || !city || !quizCode) {
      return NextResponse.json(
        { success: false, error: 'Name, city, and quiz code are required' },
        { status: 400 }
      );
    }

    const lead = {
      name: String(name).slice(0, 100),
      city: String(city).slice(0, 50),
      interest: String(interest || 'Not specified').slice(0, 50),
      score: Number(score) || 0,
      mode: String(mode || 'mix').slice(0, 20),
      quizCode: String(quizCode).slice(0, 30),
      date: new Date().toISOString(),
    };

    quizLeads.push(lead);

    // Keep only last 1000 leads in memory
    if (quizLeads.length > 1000) {
      quizLeads.splice(0, quizLeads.length - 1000);
    }

    return NextResponse.json({ success: true, message: 'Quiz lead saved' });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ leads: quizLeads, count: quizLeads.length });
}
