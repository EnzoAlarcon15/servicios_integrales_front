import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

export default function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    try {
      const res = await api.post('/api/admin/login', { username, password });
      const token = res.data?.token;
      if (token) {
        localStorage.setItem('admin_token', token);
        navigate('/admin/panel');
      } else {
        setErr('Credenciales inválidas');
      }
    } catch {
      setErr('Credenciales inválidas');
    }
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Ingreso de Administrador</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full border rounded-md px-3 py-2"
        />
        {err && <div className="text-red-600">{err}</div>}
        <button className="w-full rounded-md bg-slate-900 text-white py-2 hover:bg-slate-800">
          Ingresar
        </button>
      </form>
    </div>
  );
}