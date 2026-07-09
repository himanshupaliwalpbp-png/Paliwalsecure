/**
 * Database Status Helper
 *
 * Detects whether the Prisma database is available. In production (Vercel
 * serverless), SQLite is not supported — the admin needs to migrate to
 * Postgres (Neon, Vercel Postgres, or Supabase) and set DATABASE_URL
 * accordingly.
 *
 * All admin APIs use this to gracefully degrade: when DB is unavailable,
 * they return demo/sample data with `dbConnected: false` flag so the
 * frontend can show a "Database not connected" banner.
 */

let _dbAvailable: boolean | null = null;

export async function isDbAvailable(): Promise<boolean> {
  if (_dbAvailable !== null) return _dbAvailable;

  try {
    const { db } = await import('@/lib/db');
    // Lightweight query — just count adminUsers
    await db.adminUser.count();
    _dbAvailable = true;
    return true;
  } catch (err) {
    _dbAvailable = false;
    console.warn('[DB_STATUS] Database not available — using demo mode:', (err as Error)?.message?.slice(0, 100));
    return false;
  }
}

/**
 * Demo data generator — returns realistic sample data so the admin UI
 * looks impressive even before the database is configured.
 */
export function getDemoDashboardData() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10);

  return {
    metrics: {
      totalLeads: 247,
      newLeadsToday: 12,
      pendingCallbacks: 8,
      pendingReviews: 5,
      approvedReviews: 142,
      avgRating: 4.8,
      activePolicies: 384,
      expiring7d: 7,
      expiring30d: 23,
      totalClients: 412,
    },
    recentLeads: [
      { id: 'demo-1', name: 'Rajesh Kumar', phone: '98765*****2', city: 'Kota', insuranceType: 'Health', status: 'NEW', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
      { id: 'demo-2', name: 'Priya Sharma', phone: '87654*****9', city: 'Jaipur', insuranceType: 'Life', status: 'NEW', createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
      { id: 'demo-3', name: 'Amit Patel', phone: '76543*****8', city: 'Udaipur', insuranceType: 'Motor', status: 'CONTACTED', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
      { id: 'demo-4', name: 'Sneha Gupta', phone: '65432*****7', city: 'Ajmer', insuranceType: 'Health', status: 'NEW', createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString() },
      { id: 'demo-5', name: 'Vikram Singh', phone: '98765*****1', city: 'Jodhpur', insuranceType: 'Travel', status: 'CONTACTED', createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString() },
      { id: 'demo-6', name: 'Anjali Mehta', phone: '87654*****8', city: 'Bikaner', insuranceType: 'Home', status: 'NEW', createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
    ],
    recentCallbacks: [
      { id: 'cb-1', name: 'Rajesh Kumar', mobile: '98765*****2', preferredTime: 'asap', status: 'PENDING', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString() },
      { id: 'cb-2', name: 'Mohit Jain', mobile: '98765*****3', preferredTime: '1hour', status: 'PENDING', createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString() },
      { id: 'cb-3', name: 'Kavita Rathore', mobile: '98765*****4', preferredTime: '2-5pm', status: 'PENDING', createdAt: new Date(Date.now() - 90 * 60 * 1000).toISOString() },
    ],
    leadsByDay: Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return {
        date: d.toISOString().slice(0, 10),
        count: Math.floor(Math.random() * 15) + 3 + (i > 10 ? 5 : 0),
      };
    }),
    leadsByInsuranceType: [
      { type: 'Health', count: 87 },
      { type: 'Life', count: 54 },
      { type: 'Motor', count: 42 },
      { type: 'Travel', count: 28 },
      { type: 'Home', count: 19 },
      { type: 'Other', count: 17 },
    ],
    recentActivity: [
      { id: 'a1', action: 'LOGIN', entity: 'AdminUser', details: '{}', createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(), userName: 'Himanshu' },
      { id: 'a2', action: 'CREATE', entity: 'Lead', details: '{}', createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(), userName: 'System' },
      { id: 'a3', action: 'UPDATE', entity: 'Lead', details: '{}', createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), userName: 'Himanshu' },
      { id: 'a4', action: 'APPROVE', entity: 'Review', details: '{}', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), userName: 'Himanshu' },
      { id: 'a5', action: 'LOGOUT', entity: 'AdminUser', details: '{}', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), userName: 'Himanshu' },
    ],
    _demo: true,
  };
}

/**
 * Demo analytics data — returns realistic GA4-style sample data
 */
export function getDemoAnalyticsData(days: number = 30) {
  const dailyTraffic = Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const base = isWeekend ? 180 : 280;
    return {
      date: d.toISOString().slice(0, 10),
      users: base + Math.floor(Math.random() * 80) + (i > days - 7 ? 40 : 0),
      sessions: base + Math.floor(Math.random() * 100) + 30,
    };
  });

  const totalUsers = dailyTraffic.reduce((s, d) => s + d.users, 0);
  const totalSessions = dailyTraffic.reduce((s, d) => s + d.sessions, 0);

  return {
    property: 'demo-property',
    range: {
      start: dailyTraffic[0].date,
      end: dailyTraffic[dailyTraffic.length - 1].date,
      days,
    },
    metrics: {
      totalUsers,
      newUsers: Math.floor(totalUsers * 0.68),
      sessions: totalSessions,
      pageviews: Math.floor(totalSessions * 2.4),
      bounceRate: 42.3,
      avgSessionDuration: 184,
    },
    topPages: [
      { path: '/', views: Math.floor(totalUsers * 0.45), avgTime: 245 },
      { path: '/health-insurance', views: Math.floor(totalUsers * 0.18), avgTime: 312 },
      { path: '/insuregpt', views: Math.floor(totalUsers * 0.12), avgTime: 425 },
      { path: '/compare', views: Math.floor(totalUsers * 0.08), avgTime: 187 },
      { path: '/life-insurance', views: Math.floor(totalUsers * 0.06), avgTime: 268 },
      { path: '/car-insurance', views: Math.floor(totalUsers * 0.04), avgTime: 154 },
      { path: '/blog/health-insurance-guide-2026', views: Math.floor(totalUsers * 0.03), avgTime: 412 },
      { path: '/free-audit', views: Math.floor(totalUsers * 0.02), avgTime: 198 },
      { path: '/about', views: Math.floor(totalUsers * 0.015), avgTime: 145 },
      { path: '/contact', views: Math.floor(totalUsers * 0.01), avgTime: 167 },
    ],
    topSources: [
      { source: 'Organic Search', users: Math.floor(totalUsers * 0.52), sessions: Math.floor(totalSessions * 0.48) },
      { source: 'Direct', users: Math.floor(totalUsers * 0.21), sessions: Math.floor(totalSessions * 0.24) },
      { source: 'Social', users: Math.floor(totalUsers * 0.14), sessions: Math.floor(totalSessions * 0.13) },
      { source: 'Referral', users: Math.floor(totalUsers * 0.08), sessions: Math.floor(totalSessions * 0.09) },
      { source: 'Email', users: Math.floor(totalUsers * 0.05), sessions: Math.floor(totalSessions * 0.06) },
    ],
    deviceBreakdown: [
      { device: 'mobile', users: Math.floor(totalUsers * 0.68) },
      { device: 'desktop', users: Math.floor(totalUsers * 0.26) },
      { device: 'tablet', users: Math.floor(totalUsers * 0.06) },
    ],
    countryBreakdown: [
      { country: 'India', users: Math.floor(totalUsers * 0.94) },
      { country: 'United States', users: Math.floor(totalUsers * 0.02) },
      { country: 'United Arab Emirates', users: Math.floor(totalUsers * 0.015) },
      { country: 'United Kingdom', users: Math.floor(totalUsers * 0.01) },
      { country: 'Singapore', users: Math.floor(totalUsers * 0.005) },
    ],
    dailyTraffic,
    _demo: true,
  };
}

/**
 * Demo site config — returns empty values when DB is missing
 */
export function getDemoSiteConfig() {
  return {
    ga_measurement_id: { value: 'G-TKQ9X6G5HX', description: 'GA4 Measurement ID', updatedAt: new Date().toISOString() },
    google_site_verification: { value: '', description: 'Google Search Console verification', updatedAt: new Date().toISOString() },
    gtm_container_id: { value: 'GTM-P47L386Z', description: 'GTM Container ID', updatedAt: new Date().toISOString() },
    ga_service_account_json: { value: '', description: 'GA4 service account JSON', updatedAt: new Date().toISOString() },
    search_console_property_id: { value: '', description: 'GA4 Property ID', updatedAt: new Date().toISOString() },
    _demo: true,
  };
}
