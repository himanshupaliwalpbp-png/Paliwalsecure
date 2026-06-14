import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

// GET /api/insuranceos/dashboard - Dashboard KPIs
export async function GET() {
  try {
    const totalClients = await db.insuranceClient.count();
    const activePolicies = await db.insurancePolicy.count({ where: { status: 'ACTIVE' } });

    const today = new Date();
    const thirtyDaysLater = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    const renewalsThisMonth = await db.insurancePolicy.count({
      where: { odEndDate: { gte: today, lte: thirtyDaysLater }, status: 'ACTIVE' },
    });

    const expiring7Days = await db.insurancePolicy.count({
      where: { odEndDate: { gte: today, lte: sevenDaysLater }, status: 'ACTIVE' },
    });

    const expiring30Days = await db.insurancePolicy.count({
      where: { odEndDate: { gte: today, lte: thirtyDaysLater }, status: 'ACTIVE' },
    });

    // Total premium and estimated commission (12% of OD premium)
    const policies = await db.insurancePolicy.findMany({ where: { status: 'ACTIVE' } });
    const totalPremium = policies.reduce((sum, p) => sum + (p.totalPremium || p.premium), 0);
    const estimatedCommission = totalPremium * 0.12;

    // Renewal premium value (policies expiring in 30 days)
    const renewalPolicies = await db.insurancePolicy.findMany({
      where: { odEndDate: { gte: today, lte: thirtyDaysLater }, status: 'ACTIVE' },
    });
    const renewalPremiumValue = renewalPolicies.reduce((sum, p) => sum + (p.totalPremium || p.premium), 0);

    // Policy mix by insurer
    const policyMix = await db.insurancePolicy.groupBy({
      by: ['insurer'],
      _count: { id: true },
      where: { status: 'ACTIVE' },
    });

    // Category split
    const categorySplit = await db.insurancePolicy.groupBy({
      by: ['category'],
      _count: { id: true },
      where: { status: 'ACTIVE' },
    });

    // Fuel type split for motor
    const fuelSplit = await db.insurancePolicy.groupBy({
      by: ['fuelType'],
      _count: { id: true },
      where: { status: 'ACTIVE', category: 'motor' },
    });

    // Recent policies (last 10)
    const recentPolicies = await db.insurancePolicy.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { client: { select: { name: true, phone: true } } },
    });

    // Urgent renewals
    const urgentRenewals = await db.insurancePolicy.findMany({
      where: { odEndDate: { gte: today, lte: thirtyDaysLater }, status: 'ACTIVE' },
      orderBy: { odEndDate: 'asc' },
      include: { client: { select: { name: true, phone: true } } },
      take: 20,
    });

    // Monthly premium data for chart (last 12 months)
    const monthlyPremiums: { month: string; premium: number }[] = [];
    for (let i = 11; i >= 0; i--) {
      const monthStart = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthEnd = new Date(today.getFullYear(), today.getMonth() - i + 1, 0);
      const monthPolicies = await db.insurancePolicy.findMany({
        where: { createdAt: { gte: monthStart, lte: monthEnd } },
      });
      const monthPremium = monthPolicies.reduce((sum, p) => sum + (p.totalPremium || p.premium), 0);
      monthlyPremiums.push({
        month: monthStart.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' }),
        premium: monthPremium,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        totalClients,
        activePolicies,
        renewalsThisMonth,
        totalPremium,
        estimatedCommission,
        expiring7Days,
        expiring30Days,
        renewalPremiumValue,
        policyMix,
        categorySplit,
        fuelSplit,
        recentPolicies,
        urgentRenewals,
        monthlyPremiums,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
