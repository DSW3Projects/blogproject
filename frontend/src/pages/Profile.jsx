import React, { useState, useEffect } from 'react';

export default function UserProfile({ toggleTheme, theme }) {
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch('/api/perfil/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const data = await res.json();
        setUser(data);
        setProfileImage(data.userprofile?.profile_image || '');
      } catch (error) {
        console.error('Error cargando usuario', error);
      }
    }

    fetchUser();
  }, []);

  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const handleImageSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('profile_image', profileImage);

    await fetch('/api/perfil/actualizar-imagen/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
      },
      body: formData,
    });

    window.location.reload();
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  };

  if (!user) return <p style={{ textAlign: 'center' }}>Cargando perfil...</p>;

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px 16px',
        backgroundColor: theme === 'dark' ? '#111' : '#f7f7f7',
        color: theme === 'dark' ? '#fff' : '#000',
        transition: 'all 0.4s ease',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          backgroundColor: theme === 'dark' ? '#1f2937' : '#fff',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <img
              src={
                user.userprofile?.profile_image ||
                `https://ui-avatars.com/api/?name=${user.username}&background=random&color=fff&size=128`
              }
              alt="Avatar"
              style={{
                width: '128px',
                height: '128px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '4px solid #ec4899',
              }}
            />
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '16px' }}>{user.username}</h2>
            <p style={{ fontSize: '14px', color: '#999' }}>{user.email}</p>
            <span
              style={{
                marginTop: '8px',
                display: 'inline-block',
                backgroundColor: user.is_superuser ? '#e9d5ff' : '#dbeafe',
                color: user.is_superuser ? '#7e22ce' : '#1d4ed8',
                padding: '4px 12px',
                borderRadius: '9999px',
                fontWeight: '600',
                fontSize: '12px',
              }}
            >
              {user.is_superuser ? 'Administrador' : 'Usuario'}
            </span>
          </div>

          <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
              Detalles del perfil
            </h3>

            <p>
              <strong>Nombre de usuario:</strong> {user.username}
            </p>
            <p>
              <strong>Correo electrónico:</strong> {user.email}
            </p>
            <p>
              <strong>Fecha de registro:</strong>{' '}
              {new Date(user.date_joined).toLocaleDateString('es-ES')}
            </p>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontWeight: '600' }}>Opciones</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
                <a href="/password-change" style={{ color: '#3b82f6' }}>
                  Cambiar contraseña
                </a>
                <button onClick={handleLogout} style={{ color: '#dc2626', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleImageSubmit}
          encType="multipart/form-data"
          style={{
            marginTop: '32px',
            paddingTop: '24px',
            borderTop: '1px solid #ccc',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <label style={{ fontWeight: '600' }}>Cambiar imagen de perfil:</label>
          <input type="file" onChange={handleImageChange} />
          <button
            type="submit"
            style={{
              backgroundColor: '#ec4899',
              color: 'white',
              padding: '8px 16px',
              border: 'none',
              borderRadius: '12px',
              fontWeight: '600',
              cursor: 'pointer',
              alignSelf: 'flex-start',
            }}
          >
            Guardar imagen
          </button>
        </form>
      </div>
    </div>
  );
}
