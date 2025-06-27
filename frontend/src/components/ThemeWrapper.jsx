// src/components/ThemeWrapper.jsx
import React, { useEffect, useState } from 'react';

export default function ThemeWrapper({ children }) {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setTheme('dark');
    } else {
      document.documentElement.classList.remove('dark');
      setTheme('light');
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    const lightBg = "url('https://img.freepik.com/foto-gratis/pareja-besada-sol-abraza-disfrutando-belleza-naturaleza-generada-ia_188544-43212.jpg?semt=ais_hybrid&w=740')";
    const darkBg = "url('https://images.unsplash.com/photo-1494774157365-9e04c6720e47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1470&q=80')";

    html.style.backgroundImage = theme === 'dark' ? darkBg : lightBg;
    html.style.backgroundSize = 'cover';
    html.style.backgroundAttachment = 'fixed';
    html.style.backgroundPosition = 'center';
    html.style.backgroundRepeat = 'no-repeat';
    html.style.backgroundColor = theme === 'dark' ? '#000' : '#fff';
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.classList.toggle('dark');
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return (
    <>
      {React.cloneElement(children, { toggleTheme, theme })}
    </>
  );
}
