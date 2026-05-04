'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: '#030f0f',
      color: '#ffffff',
      fontFamily: 'var(--font-manrope)',
      gap: '16px',
      textAlign: 'center',
      padding: '24px',
    }}>
      <h1 style={{ fontSize: '96px', fontWeight: 800, color: '#02DF82', margin: 0, lineHeight: 1 }}>404</h1>
      <h2 style={{ fontSize: '24px', fontWeight: 600, margin: 0 }}>Page Not Found</h2>
      <p style={{ fontSize: '14px', color: '#8a9a9a', maxWidth: '360px' }}>
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link href="/dashboard" style={{
        marginTop: '8px',
        padding: '10px 24px',
        background: '#02DF82',
        color: '#030f0f',
        borderRadius: '8px',
        fontWeight: 600,
        fontSize: '14px',
        textDecoration: 'none',
      }}>
        Go to Dashboard
      </Link>
    </div>
  );
}
