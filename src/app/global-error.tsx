'use client';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  console.error('[PaliwalSecure] Global error:', error?.message, error?.stack);

  return (
    <html lang="en">
      <body style={{ margin: 0, background: '#0A1330' }}>
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          fontFamily: 'system-ui, sans-serif',
        }}>
          <div style={{ maxWidth: '28rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '3rem', height: '3rem', borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #C98A1C, #E0A830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <span style={{ fontWeight: 'bold', color: '#060B1E', fontSize: '1.5rem' }}>P</span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                Paliwal Secure
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#fff', marginBottom: '0.5rem' }}>
              Critical Error
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
              Something went wrong. Please refresh or contact us on WhatsApp.
            </p>
            <button
              onClick={reset}
              style={{
                padding: '0.75rem 2rem', borderRadius: '0.75rem',
                background: 'linear-gradient(135deg, #C98A1C, #E0A830)',
                color: '#0A1330', fontWeight: '600', border: 'none',
                cursor: 'pointer', fontSize: '0.875rem',
              }}
            >
              Try Again
            </button>
            <div style={{ marginTop: '1rem' }}>
              <a
                href="https://wa.me/919257877312"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#4ade80', fontSize: '0.875rem', textDecoration: 'none' }}
              >
                📞 WhatsApp: 9257877312
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
