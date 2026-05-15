import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET — Public endpoint to fetch site settings (only safe/public keys)
export async function GET() {
  try {
    // Only expose safe public settings
    const publicKeys = ['ga_measurement_id', 'site_name', 'site_tagline'];

    const settings = await db.siteSetting.findMany({
      where: {
        key: { in: publicKeys },
      },
      select: {
        key: true,
        value: true,
      },
    });

    // Convert to object for easy consumption
    const settingsMap: Record<string, string> = {};
    settings.forEach((s) => {
      settingsMap[s.key] = s.value;
    });

    return NextResponse.json({
      success: true,
      settings: settingsMap,
    });
  } catch (error) {
    console.error('Error fetching public settings:', error);
    return NextResponse.json(
      { success: false, settings: {} },
      { status: 500 }
    );
  }
}
