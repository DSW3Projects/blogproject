import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Páginas
import Login from './pages/Login';
import Register from './pages/Register';
import AllBlogs from './pages/AllBlogs';
import CreateBlog from './pages/CreateBlog';
import BlogDetail from './pages/BlogDetail';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';

// Componente cursor corazón
function HeartCursor() {
  useEffect(() => {
    const cursor = document.createElement('div');
    cursor.style.position = 'fixed';
    cursor.style.width = '30px';
    cursor.style.height = '30px';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999';
    cursor.style.userSelect = 'none';
    cursor.style.backgroundImage = `
      url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="pink"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 2.44C13.09 4.01 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>')`;
    cursor.style.backgroundSize = 'contain';
    cursor.style.backgroundRepeat = 'no-repeat';
    cursor.style.transition = 'transform 0.3s ease';
    cursor.style.transformOrigin = 'center';
    cursor.style.willChange = 'transform';

    const styleTag = document.createElement('style');
    styleTag.innerHTML = `
      @keyframes heartbeat {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.3); }
      }
    `;
    document.head.appendChild(styleTag);

    cursor.style.animation = 'heartbeat 1s infinite ease-in-out';

    document.body.appendChild(cursor);

    function moveCursor(e) {
      cursor.style.left = e.clientX - 15 + 'px'; // centrado
      cursor.style.top = e.clientY - 15 + 'px';
    }

    window.addEventListener('mousemove', moveCursor);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.body.removeChild(cursor);
      document.head.removeChild(styleTag);
    };
  }, []);

  return null;
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      root.classList.remove('dark');
      document.body.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((curr) => (curr === 'dark' ? 'light' : 'dark'));
  }

  return (
    <>
      <HeartCursor />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login toggleTheme={toggleTheme} theme={theme} />} />
          <Route path="/login" element={<Login toggleTheme={toggleTheme} theme={theme} />} />
          <Route path="/register" element={<Register toggleTheme={toggleTheme} theme={theme} />} />
          <Route path="/blogs" element={<AllBlogs toggleTheme={toggleTheme} theme={theme} />} />
          <Route path="/create-blog" element={<CreateBlog toggleTheme={toggleTheme} theme={theme} />} />
          <Route path="/blogs/:id" element={<BlogDetail toggleTheme={toggleTheme} theme={theme} />} />
          <Route path="/profile" element={<Profile toggleTheme={toggleTheme} theme={theme} />} />
          <Route path="/dashboard" element={<Dashboard toggleTheme={toggleTheme} theme={theme} />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}
