import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const patchSchema = z.object({
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']),
});

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validated = patchSchema.parse(body);

    const existing = await db.callbackRequest.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Callback request not found' },
        { status: 404 }
      );
    }

    const updated = await db.callbackRequest.update({
      where: { id },
      data: { status: validated.status },
    });

    return NextResponse.json({
      success: true,
      message: 'Callback request updated successfully',
      data: updated,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: error.errors[0].message },
        { status: 400 }
      );
    }
    console.error('Callback update error:', error);
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    );
  }
}
