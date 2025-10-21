import { useEffect, useState } from 'react';
import ServiceCard from '../components/ServiceCard.jsx';
import api from '../lib/api.js';

export default function PublicHome() {
  const [services, setServices] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await api.get('/api/services');
        setServices(res.data?.data || []);
      } catch (e) {
        setErr('No se pudieron cargar los servicios');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = services.filter(s => {
    const t = `${s.name} ${s.description}`.toLowerCase();
    return t.includes(q.toLowerCase());
  });

  return (
    <div className="container-fluid section-padding space-y-8">
      <section className="text-center space-y-3">
        <h1 className="section-title">Encuentra servicios confiables</h1>
        <p className="muted-text">Busca electricistas, gasistas y más. Contacta por WhatsApp y negocia tu presupuesto.</p>
      </section>

      <div className="flex items-center gap-3">
        <input
          type="text"
          placeholder="Buscar por nombre o descripción…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="form-control"
        />
      </div>

      {loading && <div className="muted-text">Cargando servicios…</div>}
      {err && <div className="text-red-600">{err}</div>}
      {!loading && !err && filtered.length === 0 && (
        <div className="muted-text">No hay servicios que coincidan con tu búsqueda.</div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map(s => (
          <ServiceCard key={s.id} service={s} />
        ))}
      </div>
    </div>
  );
}