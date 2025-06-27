import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function BlogDetail({ toggleTheme, theme }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState({
    tags: [],
    author: {},
    reviews: [],
  });
  const [loading, setLoading] = useState(true);
  const isLoggedIn = !!localStorage.getItem('access_token');

  // Función para eliminar solo las etiquetas <figure ...>...</figure> del contenido
  const cleanContent = (html) => {
    if (!html) return '';
    return html.replace(/<figure[^>]*>[\s\S]*?<\/figure>/gi, '');
  };

  useEffect(() => {
    async function fetchBlog() {
      try {
        const response = await fetch(`/api/blogs/${id}/`);
        if (!response.ok) throw new Error('Blog no encontrado');
        const data = await response.json();
        setBlog(data);
      } catch (error) {
        console.error('Error loading blog:', error);
        setBlog(null);
      } finally {
        setLoading(false);
      }
    }

    fetchBlog();
  }, [id]);

  if (loading)
    return <p style={{ padding: '20px', textAlign: 'center' }}>Cargando...</p>;

  if (!blog)
    return <p style={{ padding: '20px', textAlign: 'center' }}>Blog no encontrado.</p>;

  const mainBg = theme === 'dark' ? '#1f2937' : '#ffffff';
  const mainText = theme === 'dark' ? '#f3f4f6' : '#1f2937';
  const secondaryText = theme === 'dark' ? '#9ca3af' : '#4b5563';
  const reviewBg = theme === 'dark' ? '#374151' : '#f3f4f6';
  const reviewText = theme === 'dark' ? '#f3f4f6' : '#1f2937';
  const likeColor = '#a32f59';

  return (
    <main
      style={{
        cursor: 'default', // Forzar cursor visible siempre, flecha normal
        padding: '40px 20px',
        maxWidth: '800px',
        margin: '0 auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        color: mainText,
        minHeight: '100vh',
      }}
    >
      <div
        style={{
          background: mainBg,
          padding: '32px',
          borderRadius: '16px',
          boxShadow: '0 8px 24px rgba(163, 47, 89, 0.25)',
          transition: 'all 0.5s ease',
        }}
      >
        <article>
          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: '900',
              marginBottom: '24px',
              color: likeColor,
              letterSpacing: '0.05em',
              textAlign: 'center',
            }}
          >
            {blog.title || 'Sin título'}
          </h1>

          {/* Mostrar siempre la imagen principal */}
          {blog.first_image_url && (
            <img
              src={blog.first_image_url}
              alt={blog.title}
              style={{
                display: 'block',
                margin: '0 auto 28px',
                maxWidth: '100%',
                maxHeight: '400px',
                objectFit: 'cover',
                borderRadius: '14px',
                boxShadow: '0 4px 20px rgba(163, 47, 89, 0.3)',
              }}
            />
          )}

          {/* Mostrar contenido limpio, sin etiquetas <figure> */}
          <p
            style={{
              fontSize: '1.125rem',
              lineHeight: '1.6',
              marginBottom: '28px',
              whiteSpace: 'pre-wrap',
              textAlign: 'left',
            }}
            dangerouslySetInnerHTML={{ __html: cleanContent(blog.content) }}
          ></p>

          <p
            style={{
              fontSize: '0.9rem',
              color: secondaryText,
              fontStyle: 'italic',
              textAlign: 'left',
              marginBottom: '24px',
            }}
          >
            Por <strong>{blog.author?.username || 'Anónimo'}</strong> -{' '}
            {blog.created_at
              ? new Date(blog.created_at).toLocaleString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Fecha no disponible'}
          </p>

          <div style={{ marginTop: '24px', textAlign: 'left' }}>
            <h3
              style={{
                fontSize: '1.125rem',
                fontWeight: '700',
                marginBottom: '12px',
                color: likeColor,
              }}
            >
              Etiquetas:
            </h3>
            {blog.tags && blog.tags.length > 0 ? (
              blog.tags.map((tag) => (
                <span
                  key={tag.id}
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#fce7f3',
                    color: '#9d174d',
                    fontSize: '0.85rem',
                    fontWeight: '600',
                    padding: '6px 12px',
                    borderRadius: '9999px',
                    marginRight: '8px',
                    marginBottom: '8px',
                    userSelect: 'none',
                  }}
                >
                  {tag.name}
                </span>
              ))
            ) : (
              <span style={{ fontSize: '1rem', color: secondaryText }}>
                No hay etiquetas
              </span>
            )}
          </div>
        </article>

        {/* Sección de opiniones (reviews) */}
        <section style={{ marginTop: '56px' }}>
          <h2
            style={{
              fontSize: '2rem',
              fontWeight: '900',
              color: likeColor,
              marginBottom: '28px',
              textAlign: 'center',
            }}
          >
            Opiniones
          </h2>

          {blog.reviews && blog.reviews.length > 0 ? (
            blog.reviews.map((review) => (
              <div
                key={review.id}
                style={{
                  backgroundColor: reviewBg,
                  color: reviewText,
                  padding: '24px',
                  borderRadius: '14px',
                  marginBottom: '28px',
                  boxShadow: `0 6px 16px rgba(163, 47, 89, 0.15)`,
                  transition: 'transform 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '12px',
                  }}
                >
                  <p
                    style={{
                      fontWeight: '700',
                      color: likeColor,
                      fontSize: '1rem',
                      userSelect: 'none',
                      textAlign: 'left',
                      flex: 1,
                    }}
                  >
                    {review.reviewer?.username || 'Usuario'} - {review.rating || 0}/5 ❤️
                  </p>
                  <button
                    style={{
                      fontSize: '1rem',
                      color: likeColor,
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer', // cursor manito en botones
                      fontWeight: '700',
                      userSelect: 'none',
                    }}
                    title="Likes"
                  >
                    👍 {review.total_likes || 0}
                  </button>
                </div>

                {review.first_image_url && (
                  <img
                    src={review.first_image_url}
                    alt={`Imagen comentario ${review.id}`}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '300px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      marginBottom: '16px',
                      boxShadow: `0 4px 12px rgba(163, 47, 89, 0.2)`,
                      display: 'block',
                      marginLeft: 'auto',
                      marginRight: 'auto',
                    }}
                  />
                )}

                <p
                  style={{
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    whiteSpace: 'pre-wrap',
                    marginBottom: '14px',
                    textAlign: 'left',
                  }}
                  dangerouslySetInnerHTML={{ __html: review.comment || '' }}
                ></p>

                {(review.comments || []).length > 0 && (
                  <ul
                    style={{
                      marginTop: '14px',
                      paddingLeft: '20px',
                      color: secondaryText,
                      fontSize: '0.95rem',
                      textAlign: 'left',
                    }}
                  >
                    {(review.comments || []).map((comment) => (
                      <li key={comment.id} style={{ marginBottom: '10px' }}>
                        <strong>{comment.commenter?.username || 'Anonimo'}</strong>: {comment.content}
                        <button
                          style={{
                            marginLeft: '10px',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer', // manito en botones
                            color: likeColor,
                            fontWeight: '700',
                            fontSize: '13px',
                          }}
                          title="Likes"
                        >
                          👍 {comment.total_likes || 0}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}

                <div style={{ marginTop: '16px', textAlign: 'right' }}>
                  {isLoggedIn ? (
                    <button
                      onClick={() => navigate(`/add-comment/${blog.id}/${review.id}`)}
                      style={{
                        fontSize: '1rem',
                        color: likeColor,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer', // manito en botón
                        textDecoration: 'underline',
                        fontWeight: '700',
                      }}
                    >
                      Agregar comentario
                    </button>
                  ) : (
                    <button
                      onClick={() => navigate(`/login?next=/blogs/${blog.id}`)}
                      style={{
                        fontSize: '1rem',
                        color: likeColor,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer', // manito en botón
                        textDecoration: 'underline',
                        fontWeight: '700',
                      }}
                    >
                      Inicia sesión para comentar
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <p style={{ color: secondaryText, fontStyle: 'italic', textAlign: 'center' }}>
              Aún no hay opiniones, ¡sé el primero en opinar!
            </p>
          )}

          <div style={{ marginTop: '32px', textAlign: 'center' }}>
            {isLoggedIn ? (
              <button
                onClick={() => navigate(`/add-review/${blog.id}`)}
                disabled={blog.user_has_reviewed}
                style={{
                  padding: '14px 26px',
                  borderRadius: '12px',
                  backgroundColor: blog.user_has_reviewed ? '#9ca3af' : likeColor,
                  color: 'white',
                  border: 'none',
                  cursor: blog.user_has_reviewed ? 'not-allowed' : 'pointer', // puntero acorde estado
                  fontWeight: '900',
                  fontSize: '1.125rem',
                  transition: 'background-color 0.3s ease',
                  userSelect: 'none',
                }}
                title={blog.user_has_reviewed ? 'Ya hiciste una reseña' : 'Hacer reseña'}
              >
                {blog.user_has_reviewed ? 'Ya hiciste una reseña' : 'Hacer reseña'}
              </button>
            ) : (
              <p style={{ marginTop: '16px', fontSize: '1rem', textAlign: 'center' }}>
                <a
                  href="/login"
                  style={{
                    color: likeColor,
                    textDecoration: 'underline',
                    cursor: 'pointer', // manito en enlace
                  }}
                >
                  Inicia sesión
                </a>{' '}
                para dejar una reseña.
              </p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
