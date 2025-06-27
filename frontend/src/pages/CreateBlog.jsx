import React, { useState, useEffect, useRef } from 'react';

export default function CreateBlog({ toggleTheme, theme }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const [error, setError] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tagInput, setTagInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const dropdownRef = useRef();

  useEffect(() => {
    fetchTags();
  }, []);

  // Cargar tags existentes
  const fetchTags = async () => {
    try {
      const res = await fetch('/api/tags/');
      const data = await res.json();
      setAllTags(data);
    } catch (err) {
      console.error('Error al cargar tags', err);
    }
  };

  // Toggle selección tag
  const handleTagToggle = (tagId) => {
    setTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  // Crear tag nuevo (POST)
  const createNewTag = async (name) => {
    try {
      const res = await fetch('/api/tags/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error('Error creando tag');
      const newTag = await res.json();
      setAllTags((prev) => [...prev, newTag]);
      setTags((prev) => [...prev, newTag.id]);
      setTagInput('');
      setDropdownOpen(false);
    } catch (err) {
      setError('No se pudo crear el tag. Intenta de nuevo.');
    }
  };

  // Manejar submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/blogs/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ title, content, tags }),
      });
      if (!res.ok) throw new Error('Error al crear el blog');
      window.location.href = '/blogs';
    } catch (err) {
      setError('No se pudo crear el blog. Inténtalo de nuevo.');
    }
  };

  // Subir imagen al backend y obtener URL para insertar en contenido
  const handleImageUpload = async (e) => {
    if (!e.target.files.length) return;
    setUploadingImage(true);
    setError(null);

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await fetch('/api/upload-image/', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: formData,
      });
      if (!res.ok) throw new Error('Error subiendo la imagen');
      const data = await res.json();
      console.log('Respuesta upload-image:', data);
      if (data.url) {
        // Insertar la URL al final del contenido con markdown de imagen
        setContent((prev) => prev + `\n![Imagen](${data.url})\n`);
      } else {
        setError('No se recibió URL válida de la imagen');
      }
    } catch (err) {
      setError('No se pudo subir la imagen. Intenta de nuevo.');
    } finally {
      setUploadingImage(false);
      e.target.value = null; // Reset input para permitir subir la misma imagen si quiere
    }
  };

  // Filtrar tags para mostrar en dropdown según input
  const filteredTags = allTags.filter((tag) =>
    tag.name.toLowerCase().includes(tagInput.toLowerCase())
  );

  // Cerrar dropdown si clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      style={{
        maxWidth: '700px',
        margin: '40px auto',
        backgroundColor: theme === 'dark' ? '#111827' : '#ffffff',
        color: theme === 'dark' ? '#ffffff' : '#000000',
        padding: '32px',
        borderRadius: '16px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
      }}
    >
      <h1
        style={{
          fontSize: '24px',
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: '24px',
        }}
      >
        Crea un nuevo Blog
      </h1>

      {/* Botón de regresar */}
      <div style={{ marginBottom: '24px' }}>
        <button
          type="button"
          onClick={() => window.history.back()}
          style={{
            backgroundColor: '#ec4899',
            color: '#fff',
            padding: '8px 16px',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
          }}
        >
          ← Atrás
        </button>
      </div>

      {error && <p style={{ color: 'red', marginBottom: '12px' }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label>Título:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ec4899',
              background: theme === 'dark' ? '#1f2937' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
            }}
          />
        </div>

        <div style={{ marginBottom: '20px' }}>
          <label>Contenido:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            required
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ec4899',
              background: theme === 'dark' ? '#1f2937' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
              resize: 'vertical',
              fontFamily: 'inherit',
            }}
          />
          <label
            style={{
              marginTop: '8px',
              display: 'inline-block',
              cursor: 'pointer',
              color: '#ec4899',
              fontWeight: '600',
            }}
          >
            {uploadingImage ? 'Subiendo imagen...' : '📷 Subir imagen'}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
              disabled={uploadingImage}
            />
          </label>
        </div>

        <div style={{ marginBottom: '20px', position: 'relative' }} ref={dropdownRef}>
          <label>Etiquetas:</label>
          <input
            type="text"
            value={tagInput}
            onChange={(e) => {
              setTagInput(e.target.value);
              setDropdownOpen(true);
            }}
            placeholder="Escribe o selecciona tags"
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: '8px',
              border: '1px solid #ec4899',
              background: theme === 'dark' ? '#1f2937' : '#fff',
              color: theme === 'dark' ? '#fff' : '#000',
            }}
          />
          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: theme === 'dark' ? '#1f2937' : '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '4px',
                zIndex: 100,
                padding: '10px',
              }}
            >
              {filteredTags.length > 0 ? (
                filteredTags.map((tag) => (
                  <label
                    key={tag.id}
                    style={{ display: 'block', marginBottom: '6px', cursor: 'pointer' }}
                  >
                    <input
                      type="checkbox"
                      value={tag.id}
                      checked={tags.includes(tag.id)}
                      onChange={() => handleTagToggle(tag.id)}
                      style={{ marginRight: '8px' }}
                    />
                    {tag.name}
                  </label>
                ))
              ) : (
                <div>
                  <p>No hay tags que coincidan.</p>
                  <button
                    type="button"
                    onClick={() => createNewTag(tagInput.trim())}
                    disabled={!tagInput.trim()}
                    style={{
                      marginTop: '6px',
                      backgroundColor: '#ec4899',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 12px',
                      cursor: 'pointer',
                      fontWeight: '600',
                    }}
                  >
                    Crear tag "{tagInput.trim()}"
                  </button>
                </div>
              )}
            </div>
          )}
          {/* Mostrar tags seleccionados */}
          <div
            style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '8px' }}
          >
            {tags
              .map((tagId) => allTags.find((t) => t.id === tagId))
              .filter(Boolean)
              .map((tag) => (
                <div
                  key={tag.id}
                  style={{
                    backgroundColor: '#fce7f3',
                    color: '#9d174d',
                    fontSize: '12px',
                    fontWeight: '600',
                    padding: '4px 8px',
                    borderRadius: '9999px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {tag.name}
                  <button
                    type="button"
                    onClick={() => handleTagToggle(tag.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#9d174d',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                    }}
                    aria-label={`Quitar tag ${tag.name}`}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            type="submit"
            style={{
              backgroundColor: '#ec4899',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '600',
            }}
          >
            Subir
          </button>
        </div>
      </form>
    </div>
  );
}
