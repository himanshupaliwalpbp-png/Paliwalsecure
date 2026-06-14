import { NextRequest, NextResponse } from 'next/server'

/**
 * CSP Violation Reporting Endpoint
 *
 * Receives Content Security Policy violation reports from browsers.
 * In production, this should forward reports to a logging service
 * (e.g., Sentry, Datadog, or a dedicated security monitoring tool).
 * For now, we log them server-side and return 204 No Content.
 */
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    if (contentType.includes('application/csp-report') || contentType.includes('application/json')) {
      const report = await request.json()

      // Log CSP violation — in production, forward to monitoring service
      if (process.env.NODE_ENV === 'development') {
        console.warn('[CSP Violation]', JSON.stringify(report, null, 2))
      } else {
        // In production, you would send this to a monitoring service:
        // await sendToMonitoring(report);
        console.warn('[CSP Violation]', {
          'document-uri': report?.['csp-report']?.['document-uri'],
          'violated-directive': report?.['csp-report']?.['violated-directive'],
          'blocked-uri': report?.['csp-report']?.['blocked-uri'],
          'source-file': report?.['csp-report']?.['source-file'],
        })
      }
    }

    // Return 204 No Content — browsers expect this for CSP reports
    return new NextResponse(null, { status: 204 })
  } catch {
    // Silently ignore malformed reports
    return new NextResponse(null, { status: 204 })
  }
}
