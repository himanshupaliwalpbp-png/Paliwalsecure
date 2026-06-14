import { ImageResponse } from 'next/og';

export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

export default function Icon() {
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
          borderRadius: '6px',
        }}
      >
        {/* Shield shape */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '22px',
            height: '26px',
            backgroundColor: '#F4B400',
            borderRadius: '4px 4px 8px 8px',
            position: 'relative',
          }}
        >
          {/* Shield top curve accent */}
          <div
            style={{
              position: 'absolute',
              top: '0px',
              left: '0px',
              width: '22px',
              height: '8px',
              backgroundColor: '#E8B82A',
              borderRadius: '4px 4px 0px 0px',
              opacity: 0.3,
            }}
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 'bold',
              color: '#071B3B',
              lineHeight: 1,
              letterSpacing: '0.5px',
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
