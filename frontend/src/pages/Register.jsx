import React, { useState, useEffect, useRef } from "react";
import "../assets/register.css"; // Ajusta la ruta si es necesario

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [error, setError] = useState(null);
  const cursorRef = useRef(null);

  // Cursor personalizado
  useEffect(() => {
    const cursor = cursorRef.current;
    if (!cursor) return;

    function onMouseMove(e) {
      cursor.style.top = e.clientY + "px";
      cursor.style.left = e.clientX + "px";
    }
    function onMouseEnter() {
      cursor.style.filter =
        "brightness(1.2) drop-shadow(0 0 4px rgba(236, 72, 153, 0.7))";
    }
    function onMouseLeave() {
      cursor.style.filter = "none";
    }

    document.addEventListener("mousemove", onMouseMove);
    const interactiveEls = document.querySelectorAll(
      "a, button, input, [role='button']"
    );
    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", onMouseEnter);
      el.addEventListener("mouseleave", onMouseLeave);
    });

    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      interactiveEls.forEach((el) => {
        el.removeEventListener("mouseenter", onMouseEnter);
        el.removeEventListener("mouseleave", onMouseLeave);
      });
    };
  }, []);

  // Tema oscuro toggle
  useEffect(() => {
    const theme = localStorage.getItem("theme");
    if (
      theme === "dark" ||
      (!theme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  function toggleTheme() {
    document.documentElement.classList.toggle("dark");
    if (document.documentElement.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
    } else {
      localStorage.setItem("theme", "light");
    }
  }

  function togglePasswordVisibility(id) {
    const input = document.getElementById(id);
    input.type = input.type === "password" ? "text" : "password";
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Por favor ingresa un correo válido.");
      return;
    }
    if (formData.password !== formData.password2) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch("/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        const firstErrorKey = Object.keys(data)[0];
        setError(data[firstErrorKey][0]);
        return;
      }

      alert("Usuario creado exitosamente, ahora puedes iniciar sesión.");
      window.location.href = "/login";
    } catch {
      setError("Error de red. Intenta nuevamente.");
    }
  }

  return (
    <>
      <img
        id="custom-cursor"
        ref={cursorRef}
        src="data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' fill='%23ec4899' viewBox='0 0 24 24'><path d='M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z'/></svg>"
        alt="cursor"
      />

      <nav className="nav-bar">
        <div className="nav-content">
          <a href="#" className="logo">
            ❤️ Amor en Línea
          </a>
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            style={{ background: "none", border: "none", color: "white", cursor: "pointer", fontSize: "18px" }}
          >
            {document.documentElement.classList.contains("dark") ? "☀️" : "🌙"}
          </button>
        </div>
      </nav>

      <main className="register-main">
        <div className="form-container">
          <h2>Comienza tu historia de amor</h2>
          <p>Regístrate para encontrar tu pareja ideal</p>

          {error && (
            <div
              style={{
                backgroundColor: "rgba(255, 182, 193, 0.4)",
                borderLeft: "4px solid #ec4899",
                padding: "10px",
                marginBottom: "20px",
                borderRadius: "6px",
                color: "white",
                textAlign: "left",
              }}
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="username">Tu nombre de enamorado/a</label>
              <input
                type="text"
                id="username"
                name="username"
                required
                placeholder="Elige un nombre especial"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Tu correo del corazón</label>
              <input
                type="email"
                id="email"
                name="email"
                required
                placeholder="donde recibirás amor"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="password">Tu contraseña secreta</label>
              <input
                type="password"
                id="password"
                name="password"
                required
                placeholder="Protege tu corazón"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password")}
                aria-label="Toggle password visibility"
                style={{
                  position: "absolute",
                  top: "30%",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#ec4899",
                }}
              >
                👁️
              </button>
            </div>

            <div className="form-group" style={{ position: "relative" }}>
              <label htmlFor="password2">Confirma tu contraseña</label>
              <input
                type="password"
                id="password2"
                name="password2"
                required
                placeholder="Vuelve a escribirla"
                value={formData.password2}
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("password2")}
                aria-label="Toggle password visibility"
                style={{
                  position: "absolute",
                  top: "30%",
                  right: "10px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  fontSize: "18px",
                  color: "#ec4899",
                }}
              >
                👁️
              </button>
            </div>

            <button type="submit" className="submit-btn">
              Unirse al amor
            </button>
          </form>

          <p className="login-link">
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        </div>
      </main>
    </>
  );
}
