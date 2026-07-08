import type { NextConfig } from "next";

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  // X-XSS-Protection is deprecated and can introduce bypasses — disable it (browser will rely on CSP).
  { key: 'X-XSS-Protection', value: '0' },
  { key: 'Permissions-Policy', value: 'camera=(self), microphone=(self), geolocation=(), browsing-topics=()' },
  {
    key: 'Content-Security-Policy',
    value:
      "default-src 'self'; " +
      // SECURITY: 'unsafe-eval' removed — modern Next.js does not need it.
      // 'unsafe-inline' remains for styled-components / GTM inline scripts;
      // migrate to nonce-based CSP in a follow-up.
      "script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://apis.google.com; " +
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
      "font-src 'self' https://fonts.gstatic.com https://fonts.googleapis.com; " +
      "media-src 'self' blob: https://d8j0ntlcm91z4.cloudfront.net; " +
      "img-src 'self' data: blob: https://paliwalsecure.in https://paliwalsecure.com https://www.google-analytics.com https://www.googletagmanager.com; " +
      "connect-src 'self' https://paliwalsecure.in https://paliwalsecure.com https://wa.me https://api.anthropic.com https://open.bigmodel.cn https://www.google-analytics.com https://www.googletagmanager.com https://*.firebase.com https://*.zai.com blob:; " +
      "frame-src 'none'; " +
      "object-src 'none'; " +
      "base-uri 'self'; " +
      "form-action 'self'; " +
      "frame-ancestors 'none'; " +
      "upgrade-insecure-requests; " +
      "report-uri /api/csp-report; " +
      "report-to csp-endpoint",
  },
  // Reporting endpoint for CSP violations (used by report-to directive above)
  { key: 'Reporting-Endpoints', value: 'csp-endpoint="/api/csp-report"' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Permitted-Cross-Domain-Policies', value: 'none' },
  { key: 'Cross-Origin-Opener-Policy', value: 'same-origin' },
  { key: 'Cross-Origin-Resource-Policy', value: 'cross-origin' },
];

const nextConfig: NextConfig = {
  compiler: {
    styledComponents: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  turbopack: {},
  allowedDevOrigins: ['127.0.0.1'],
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
