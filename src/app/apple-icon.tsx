import { ImageResponse } from 'next/og';

export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#071B3B',
          borderRadius: '36px',
        }}
      >
        {/* Shield shape */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '120px',
            height: '140px',
            backgroundColor: '#F4B400',
            borderRadius: '16px 16px 40px 40px',
            position: 'relative',
          }}
        >
          {/* Shield top highlight */}
          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '120px',
              height: '40px',
              backgroundColor: '#E8B82A',
              borderRadius: '16px 16px 0px 0px',
              opacity: 0.3,
            }}
          />
          <span
            style={{
              fontSize: '56px',
              fontWeight: 'bold',
              color: '#071B3B',
              lineHeight: 1,
              letterSpacing: '1px',
            }}
          >
            PS
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
