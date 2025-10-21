import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, Link, useNavigate, useLocation } from 'react-router-dom';
import PublicHome from './pages/PublicHome.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import AdminPanel from './pages/AdminPanel.jsx';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuth, setIsAuth] = useState(Boolean(localStorage.getItem('admin_token')));

  useEffect(() => {
    const sync = () => setIsAuth(Boolean(localStorage.getItem('admin_token')));
    sync(); // asegura estado correcto al montar
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  // Re-sincroniza auth cuando cambia de ruta dentro de la SPA
  useEffect(() => {
    setIsAuth(Boolean(localStorage.getItem('admin_token')));
  }, [location.pathname]);

  const logout = () => {
    localStorage.removeItem('admin_token');
    setIsAuth(false);
    navigate('/');
  };

  return (
    <div>
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-semibold text-slate-800">Servicios Integrales</Link>
          <nav className="flex items-center gap-4">
            <Link to="/" className="text-slate-600 hover:text-slate-900">Inicio</Link>
            {/* Usa el token actual para decidir la ruta del enlace Admin */}
            <Link to={Boolean(localStorage.getItem('admin_token')) ? '/admin/panel' : '/admin'} className="text-slate-600 hover:text-slate-900">
              Admin
            </Link>
            {isAuth && (
              <button type="button" onClick={logout} className="rounded-md bg-slate-900 text-white px-3 py-2 hover:bg-slate-800">
                Cerrar sesión
              </button>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8">
        <Routes>
          <Route path="/" element={<PublicHome />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/panel" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <footer className="border-t bg-white">
        <div className="max-w-6xl mx-auto px-6 py-6 text-slate-500">
          © {new Date().getFullYear()} Servicios Integrales — Todos los derechos reservados
        </div>
      </footer>
    </div>
  );
}