import React, { useEffect, useState } from 'react';

export default function AllBlogs({ toggleTheme, theme }) {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [configOpen, setConfigOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Verifica si hay token para detectar login
    const token = localStorage.getItem('access_token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    async function fetchBlogs() {
      try {
        const res = await fetch('/api/blogs/');
        const data = await res.json();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlogs();
  }, []);

  // Cierra menú si clic fuera
  useEffect(() => {
    function handleClickOutside(e) {
      if (!e.target.closest('#config-menu') && !e.target.closest('#config-button')) {
        setConfigOpen(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Función para cerrar sesión y redirigir a login
  function handleLogout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }

  return (
    <>
      {/* Barra superior */}
      <nav
        style={{
          backgroundColor: 'rgba(0,0,0,0.6)',
          padding: '10px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          color: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.7)',
          position: 'sticky',
          top: 0,
          zIndex: 1000,
        }}
      >
        {/* Nombre de la web */}
        <a
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'pink',
            fontWeight: 'bold',
            fontSize: '24px',
            textDecoration: 'none',
          }}
        >
          ❤️ Amor en Línea
        </a>

        {/* Grupo de botones */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {/* Botón Crear Blog */}
          <a
            href="/create-blog"
            style={{
              color: 'white',
              backgroundColor: '#ec4899',
              padding: '8px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            📝 Crear Blog
          </a>

          {/* Mostrar botón Login solo si NO está logueado */}
          {!isLoggedIn && (
            <a
              href="/login"
              style={{
                color: 'white',
                backgroundColor: '#3b82f6',
                padding: '8px 14px',
                borderRadius: '10px',
                textDecoration: 'none',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '14px',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              🔐 Login
            </a>
          )}

          {/* Botón Tema */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{
              background: 'none',
              border: 'none',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
              padding: '4px',
            }}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>

          {/* Botón Configuraciones */}
          {isLoggedIn && (
            <div style={{ position: 'relative' }}>
              <button
                id="config-button"
                onClick={() => setConfigOpen((prev) => !prev)}
                aria-haspopup="true"
                aria-expanded={configOpen}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '20px',
                  padding: '4px',
                  userSelect: 'none',
                }}
              >
                ⚙️
              </button>

              {configOpen && (
                <div
                  id="config-menu"
                  role="menu"
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: 'calc(100% + 6px)',
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                    minWidth: '160px',
                    zIndex: 1100,
                  }}
                >
                  <a
                    href="/profile"
                    role="menuitem"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      color: 'white',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      fontWeight: '500',
                    }}
                    onClick={() => setConfigOpen(false)}
                  >
                    <span>👤</span> Ver perfil
                  </a>
                  <a
                    href="/dashboard"
                    role="menuitem"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      color: 'white',
                      textDecoration: 'none',
                      borderBottom: '1px solid rgba(255,255,255,0.1)',
                      fontWeight: '500',
                    }}
                    onClick={() => setConfigOpen(false)}
                  >
                    <span>📊</span> Dashboard
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      handleLogout();
                      setConfigOpen(false);
                    }}
                    role="menuitem"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '10px 16px',
                      color: 'white',
                      background: 'none',
                      border: 'none',
                      width: '100%',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontWeight: '500',
                    }}
                  >
                    <span>🚪</span> Salir
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Contenido principal */}
      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 16px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#111',
            marginBottom: '24px',
          }}
        >
          Todos los blogs
        </h1>

        {loading ? (
          <p style={{ textAlign: 'center' }}>Cargando...</p>
        ) : blogs.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#888' }}>Aun no se han posteado blogs.</p>
        ) : (
          <div style={{ display: 'grid', gap: '24px' }}>
            {blogs.map((blog) => (
              <div
                key={blog.id}
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                  padding: '24px',
                  color: '#111',
                  transition: 'box-shadow 0.3s ease',
                }}
                className="blog-card"
              >
                <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '12px' }}>
                  <a
                    href={`/blogs/${blog.id}/`}
                    style={{ color: '#ec4899', textDecoration: 'none' }}
                    onMouseOver={(e) => (e.target.style.color = '#f472b6')}
                    onMouseOut={(e) => (e.target.style.color = '#ec4899')}
                  >
                    {blog.first_image_url && (
                      <div
                        style={{
                          aspectRatio: '16 / 9',
                          marginBottom: '12px',
                          overflow: 'hidden',
                          borderRadius: '12px',
                        }}
                      >
                        <img
                          src={blog.first_image_url}
                          alt={`Imagen de ${blog.title}`}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            transition: 'transform 0.3s ease',
                          }}
                          onMouseOver={(e) => (e.target.style.transform = 'scale(1.05)')}
                          onMouseOut={(e) => (e.target.style.transform = 'scale(1)')}
                        />
                      </div>
                    )}
                    {blog.title}
                  </a>
                </h2>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '8px',
                  }}
                >
                  <a href={`/perfil/${blog.author.username}`}>
                    <img
                      src={
                        blog.author.userprofile?.profile_image ||
                        `https://ui-avatars.com/api/?name=${blog.author.username}&background=random&color=fff&size=64`
                      }
                      alt={`Avatar de ${blog.author.username}`}
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2px solid #ec4899',
                      }}
                    />
                  </a>
                  <p style={{ fontSize: '14px', color: '#666' }}>
                    by{' '}
                    <span style={{ fontWeight: '500', color: '#ec4899' }}>
                      {blog.author.username}
                    </span>{' '}
                    —{' '}
                    {new Date(blog.created_at).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                <p style={{ fontSize: '14px', marginTop: '8px' }}>
                  <strong>Rating:</strong>{' '}
                  {blog.average_rating ? (
                    `${parseFloat(blog.average_rating).toFixed(1)} / 5 ❤️`
                  ) : (
                    'No hay reviews'
                  )}
                </p>

                <p style={{ fontSize: '14px', marginTop: '4px' }}>
                  <strong>Tags:</strong>{' '}
                  {blog.tags.length > 0 ? (
                    blog.tags.map((tag) => (
                      <span
                        key={tag.id}
                        style={{
                          display: 'inline-block',
                          backgroundColor: '#fce7f3',
                          color: '#9d174d',
                          fontSize: '12px',
                          fontWeight: '600',
                          padding: '4px 8px',
                          borderRadius: '9999px',
                          marginRight: '6px',
                        }}
                      >
                        {tag.name}
                      </span>
                    ))
                  ) : (
                    <span style={{ color: '#aaa' }}>No tiene etiquetas</span>
                  )}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
