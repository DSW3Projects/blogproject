import React, { useState, useEffect, useRef } from 'react';

export default function Login({ toggleTheme, theme }) {
  const [formData, setFormData] = useState({ username: '', password: '', rememberMe: false });
  const [error, setError] = useState(null);
  const cursorRef = useRef(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    function onMouseMove(e) {
      cursor.style.top = e.clientY + 'px';
      cursor.style.left = e.clientX + 'px';
    }

    function onMouseEnter() {
      cursor.style.filter = 'brightness(1.2) drop-shadow(0 0 4px rgba(236, 72, 153, 0.7))';
    }
    function onMouseLeave() {
      cursor.style.filter = 'none';
    }

    document.addEventListener('mousemove', onMouseMove);
    const interactiveEls = document.querySelectorAll('a, button, input, [role="button"]');
    interactiveEls.forEach(el => {
      el.addEventListener('mouseenter', onMouseEnter);
      el.addEventListener('mouseleave', onMouseLeave);
    });

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      interactiveEls.forEach(el => {
        el.removeEventListener('mouseenter', onMouseEnter);
        el.removeEventListener('mouseleave', onMouseLeave);
      });
    };
  }, []);

  function togglePasswordVisibility() {
    const input = document.getElementById('password');
    input.type = input.type === 'password' ? 'text' : 'password';
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const response = await fetch('/api/token/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });
      if (!response.ok) {
        setError('Combinación incorrecta de usuario y contraseña. ¿Quizás es amor a primera vista?');
        return;
      }
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      localStorage.setItem('refresh_token', data.refresh);
      window.location.href = '/blogs';
    } catch (err) {
      setError('Error de red. Intenta nuevamente.');
    }
  }

  return (
    <>
      {/* Cursor personalizado */}
      <img
        ref={cursorRef}
        id="custom-cursor"
        src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23ec4899' viewBox='0 0 24 24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>"
        alt="cursor"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '24px',
          height: '24px',
          pointerEvents: 'none',
          zIndex: 9999,
          transform: 'translate(-50%, -50%)',
          transition: 'filter 0.2s ease',
        }}
      />

      {/* Barra superior */}
      <nav style={{
        backgroundColor: 'rgba(0,0,0,0.6)',
        padding: '10px 20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.7)'
      }}>
        <a href="/blogs" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          color: 'pink',
          fontWeight: 'bold',
          fontSize: '24px',
          textDecoration: 'none'
        }}>
          ❤️ Amor en Línea
        </a>
        <button
          onClick={toggleTheme}
          aria-label="Toggle theme"
          style={{
            background: 'none',
            border: 'none',
            color: 'white',
            cursor: 'pointer',
            fontSize: '20px'
          }}
        >
          {theme === 'dark' ? '☀️' : '🌙'}
        </button>
      </nav>

      <main
        style={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '20px',
          fontFamily: '"DM Sans", sans-serif',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '30px',
            borderRadius: '15px',
            maxWidth: '400px',
            width: '100%',
            boxShadow: '0 0 10px rgba(236, 72, 153, 0.7)'
          }}
        >
          <h2 style={{ fontSize: '28px', marginBottom: '8px' }}>Encuentra tu media naranja</h2>
          <p style={{ marginBottom: '20px' }}>Comparte, conecta y vive el amor</p>

          {error && (
            <div style={{
              backgroundColor: 'rgba(255, 182, 193, 0.4)',
              borderLeft: '4px solid #ec4899',
              padding: '10px',
              marginBottom: '20px',
              borderRadius: '6px',
              color: 'white'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: '16px', textAlign: 'left' }}>
              <label htmlFor="username" style={{ display: 'block', marginBottom: '6px' }}>
                Tu nombre de enamorado/a
              </label>
              <input
                type="text"
                id="username"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="Tu nombre especial"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              />
            </div>

            <div style={{ marginBottom: '16px', position: 'relative', textAlign: 'left' }}>
              <label htmlFor="password" style={{ display: 'block', marginBottom: '6px' }}>
                Tu contraseña secreta
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Tu corazón lo sabe"
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #ccc',
                  fontSize: '16px'
                }}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                style={{
                  position: 'absolute',
                  top: '30%',
                  right: '10px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '18px',
                  color: '#ec4899'
                }}
              >
                👁️
              </button>
            </div>

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px'
            }}>
              <label>
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />{' '}
                Recordar este amor
              </label>
              <a href="#" style={{ textDecoration: 'underline', color: 'white' }}>
                ¿Olvidaste tu corazón?
              </a>
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#ec4899',
                border: 'none',
                borderRadius: '10px',
                color: 'white',
                fontSize: '16px',
                cursor: 'pointer'
              }}
            >
              Conectar corazones
            </button>
          </form>

          <p style={{ marginTop: '20px', fontSize: '14px' }}>
            ¿Listo para encontrar el amor?{' '}
            <a href="/register" style={{ color: '#ec4899', textDecoration: 'underline' }}>
              Regístrate
            </a>
          </p>
        </div>
      </main>
    </>
  );
}
