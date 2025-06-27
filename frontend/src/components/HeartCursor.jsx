import React, { useEffect, useState } from 'react';

export default function HeartCursor() {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    function onMouseMove(e) {
      setPos({ x: e.clientX, y: e.clientY });
    }
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, []);

  const style = {
    position: 'fixed',
    top: pos.y,
    left: pos.x,
    pointerEvents: 'none',
    transform: 'translate(-50%, -50%)',
    fontSize: '28px',
    color: '#ec4899',
    userSelect: 'none',
    animation: 'heartbeat 1.5s infinite',
    zIndex: 999999,
  };

  return (
    <>
      <style>{`
        body, #root, html {
          cursor: none !important;
        }
        @keyframes heartbeat {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          25% { transform: translate(-50%, -50%) scale(1.2); }
          40% { transform: translate(-50%, -50%) scale(1); }
          60% { transform: translate(-50%, -50%) scale(1.15); }
          80% { transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
      <span style={style} aria-hidden="true">❤️</span>
    </>
  );
}
