import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';

export default function AdminDashboard({ toggleTheme, theme }) {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await fetch('/api/admin-dashboard/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('access_token')}`,
          },
        });
        const data = await res.json();
        setStats(data);
        renderChart(data.fechas, data.cantidades);
      } catch (err) {
        console.error('Error cargando datos del dashboard', err);
      }
    }

    fetchStats();
  }, []);

  const renderChart = (fechas, cantidades) => {
    const ctx = document.getElementById('blogsChart')?.getContext('2d');
    if (!ctx) return;

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: fechas,
        datasets: [
          {
            label: 'Blogs por día',
            data: cantidades,
            backgroundColor: 'rgba(96, 165, 250, 0.1)',
            borderColor: 'rgba(96, 165, 250, 1)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            labels: { color: theme === 'dark' ? 'white' : 'black' },
          },
        },
        scales: {
          x: {
            ticks: { color: theme === 'dark' ? 'white' : 'black' },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
          y: {
            beginAtZero: true,
            ticks: { color: theme === 'dark' ? 'white' : 'black', stepSize: 1 },
            grid: { color: 'rgba(255,255,255,0.1)' },
          },
        },
      },
    });
  };

  if (!stats) return <p style={{ textAlign: 'center' }}>Cargando...</p>;

  return (
    <div
      style={{
        backgroundColor: theme === 'dark' ? '#1f2937' : '#f0f0f0',
        color: theme === 'dark' ? '#fff' : '#000',
        minHeight: '100vh',
        padding: '40px 20px',
        transition: 'all 0.3s ease',
      }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <a
            href="/"
            style={{
              backgroundColor: '#2563eb',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '8px',
              textDecoration: 'none',
              display: 'inline-block',
              fontWeight: 'bold',
            }}
          >
            🏠 Volver al Inicio
          </a>
        </div>

        <h1
          style={{
            fontSize: '32px',
            fontWeight: 'bold',
            marginBottom: '32px',
            textAlign: 'center',
          }}
        >
          Panel de Administración
        </h1>

        {/* Tarjetas */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
          <StatCard title="Total de Blogs" value={stats.total_blogs} color="#60a5fa" />
          <StatCard title="Total de Usuarios" value={stats.total_users} color="#34d399" />
          <StatCard title="Total de Reviews" value={stats.total_reviews} color="#c084fc" />
        </div>

        {/* Informes rápidos */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px', marginBottom: '40px' }}>
          <InfoCard
            title="Blog con más reviews"
            text={
              stats.blog_mas_reviews
                ? `${stats.blog_mas_reviews.title} (${stats.blog_mas_reviews.review_count} reviews)`
                : 'No hay blogs aún.'
            }
          />
          <InfoCard
            title="Usuario con más reviews"
            text={
              stats.usuario_mas_reviews
                ? `${stats.usuario_mas_reviews.username} (${stats.usuario_mas_reviews.review_count} reviews)`
                : 'No hay usuarios aún.'
            }
          />
        </div>

        {/* Gráfico */}
        <div
          style={{
            backgroundColor: theme === 'dark' ? '#111827' : '#fff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          }}
        >
          <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '16px' }}>
            Cantidad de Blogs por Día
          </h2>
          <canvas id="blogsChart" width="400" height="200"></canvas>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }) {
  return (
    <div
      style={{
        flex: '1 1 300px',
        backgroundColor: '#111827',
        padding: '20px',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      }}
    >
      <h3 style={{ fontSize: '18px', marginBottom: '8px' }}>{title}</h3>
      <p style={{ fontSize: '28px', fontWeight: 'bold', color }}>{value}</p>
    </div>
  );
}

function InfoCard({ title, text }) {
  return (
    <div
      style={{
        flex: '1 1 400px',
        backgroundColor: '#111827',
        padding: '20px',
        borderRadius: '12px',
        color: '#fff',
        boxShadow: '0 4px 10px rgba(0,0,0,0.2)',
      }}
    >
      <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>{title}</h3>
      <p>{text}</p>
    </div>
  );
}
