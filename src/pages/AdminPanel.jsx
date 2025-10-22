import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/api.js';

export default function AdminPanel() {
  const navigate = useNavigate();

  const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const [services, setServices] = useState([]);
  const [err, setErr] = useState('');
  const [ok, setOk] = useState('');
  const [uploading, setUploading] = useState(false);

  const [form, setForm] = useState({
    name: '',
    description: '',
    image: '',
    whatsapp: '',
    email: '',
    budgets: [{ title: '', price: '' }]
  });

  const [editing, setEditing] = useState(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    image: '',
    whatsapp: '',
    email: '',
    budgets: [{ title: '', price: '' }]
  });
  const [editUploading, setEditUploading] = useState(false);

  const getId = (obj) => obj?.id ?? obj?._id;

  useEffect(() => {
    const tk = localStorage.getItem('admin_token');
    if (!tk) {
      navigate('/admin');
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const load = async () => {
    try {
      const res = await api.get('/api/services');
      setServices(res.data?.data || []);
    } catch {
      setErr('No se pudieron cargar los servicios');
    }
  };

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const addBudgetLine = () => {
    setForm(prev => ({
      ...prev,
      budgets: [...(prev.budgets || []), { title: '', price: '' }]
    }));
  };

  const updateBudgetLine = (idx, key, value) => {
    setForm(prev => {
      const next = [...(prev.budgets || [])];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, budgets: next };
    });
  };

  const removeBudgetLine = (idx) => {
    setForm(prev => {
      const next = [...(prev.budgets || [])];
      next.splice(idx, 1);
      return {
        ...prev,
        budgets: next.length ? next : [{ title: '', price: '' }]
      };
    });
  };

  const onImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const tk = localStorage.getItem('admin_token');
      const res = await api.post('/api/admin/upload', fd, {
        headers: { 'x-admin-token': tk, 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url;
      if (url) setForm(prev => ({ ...prev, image: url }));
    } finally {
      setUploading(false);
    }
  };

  const previewUrl = form.image
    ? (form.image.startsWith('http') ? form.image : `${API_BASE}${form.image}`)
    : '';

  const addService = async (e) => {
    e.preventDefault();
    setErr('');
    setOk('');
    try {
      const tk = localStorage.getItem('admin_token');
      const res = await api.post('/api/admin/services', form, {
        headers: { 'x-admin-token': tk }
      });
      setOk('Servicio agregado correctamente');
      setForm({ name: '', description: '', image: '', whatsapp: '', email: '', budgets: [{ title: '', price: '' }] });
      setServices(prev => [...prev, res.data.data]);
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Error al agregar servicio');
    }
  };

  const startEdit = (service) => {
    setEditing(service);
    setEditForm({
      name: service.name || '',
      description: service.description || '',
      image: service.image || '',
      whatsapp: service.whatsapp || '',
      email: service.email || '',
      budgets: Array.isArray(service.budgets) && service.budgets.length > 0
        ? service.budgets.map(b => ({ title: b.title || '', price: b.price || '' }))
        : [{ title: '', price: '' }]
    });
    setErr('');
    setOk('');
  };

  const cancelEdit = () => {
    setEditing(null);
    setEditForm({ name: '', description: '', image: '', whatsapp: '', email: '', budgets: [{ title: '', price: '' }] });
  };

  const onEditChange = (e) => setEditForm({ ...editForm, [e.target.name]: e.target.value });

  const addEditBudgetLine = () => {
    setEditForm(prev => ({
      ...prev,
      budgets: [...(prev.budgets || []), { title: '', price: '' }]
    }));
  };

  const updateEditBudgetLine = (idx, key, value) => {
    setEditForm(prev => {
      const next = [...(prev.budgets || [])];
      next[idx] = { ...next[idx], [key]: value };
      return { ...prev, budgets: next };
    });
  };

  const removeEditBudgetLine = (idx) => {
    setEditForm(prev => {
      const next = [...(prev.budgets || [])];
      next.splice(idx, 1);
      return {
        ...prev,
        budgets: next.length ? next : [{ title: '', price: '' }]
      };
    });
  };

  const onEditImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditUploading(true);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const tk = localStorage.getItem('admin_token');
      const res = await api.post('/api/admin/upload', fd, {
        headers: { 'x-admin-token': tk, 'Content-Type': 'multipart/form-data' },
      });
      const url = res.data?.url;
      if (url) setEditForm(prev => ({ ...prev, image: url }));
    } finally {
      setEditUploading(false);
    }
  };

  const editPreviewUrl = editForm.image
    ? (editForm.image.startsWith('http') ? editForm.image : `${API_BASE}${editForm.image}`)
    : '';

  const saveEdit = async () => {
    if (!editing) return;
    setErr('');
    setOk('');
    try {
      const tk = localStorage.getItem('admin_token');
      const sid = getId(editing);
      if (!sid) {
        setErr('ID de servicio inválido');
        return;
      }
      const res = await api.put(`/api/admin/services/${sid}`, editForm, {
        headers: { 'x-admin-token': tk }
      });
      const updated = res.data?.data;
      setServices(prev => prev.map(s => (getId(s) === sid ? updated : s)));
      setOk('Servicio actualizado correctamente');
      cancelEdit();
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Error al actualizar servicio');
    }
  };

  const deleteService = async (id) => {
    setErr('');
    setOk('');
    if (!id) {
      setErr('ID de servicio inválido');
      return;
    }
    try {
      const tk = localStorage.getItem('admin_token');
      await api.delete(`/api/admin/services/${id}`, { headers: { 'x-admin-token': tk } });
      setOk('Servicio eliminado');
      setServices(prev => prev.filter(s => getId(s) !== id));
    } catch (e2) {
      setErr(e2.response?.data?.message || 'Error al eliminar servicio');
    }
  };

  // Referencia del modal y enfoque al abrir
  const modalRef = useRef(null);
  const onModalKeyDown = (e) => { if (e.key === 'Escape') cancelEdit(); };
  useEffect(() => { if (editing) modalRef.current?.focus(); }, [editing]);

  return (
    <main className="app-panel-light">
      <header className="page-header">
        <h1 className="page-title">Panel de administración</h1>
        <p className="page-lead">Gestiona servicios y presupuestos con un diseño claro.</p>
      </header>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Agregar nuevo servicio */}
        <section className="card card-contrast card-accent-blue">
          <div className="card-header">Agregar nuevo servicio</div>
          <form onSubmit={addService} className="card-content space-y-4">
            <div className="space-y-2">
              <label className="label" htmlFor="name">Nombre</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={form.name}
                onChange={onChange}
                placeholder="Nombre (p.ej. Electricista)"
                className="form-control"
              />
            </div>

            <div className="space-y-2">
              <label className="label" htmlFor="description">Descripción</label>
              <input
                id="description"
                name="description"
                type="text"
                value={form.description}
                onChange={onChange}
                placeholder="Descripción"
                className="form-control"
              />
            </div>

            <div className="grid md:grid-cols-[1fr_auto] items-center gap-4">
              <div className="space-y-2">
                <label className="label">Imagen</label>
                <input type="file" accept="image/*" onChange={onImageSelect} className="form-control" />
              </div>
              <div className="flex items-center gap-3">
                {previewUrl && (
                  <img src={previewUrl} alt="Preview" className="h-16 w-20 rounded object-cover border" />
                )}
                <span className="small-muted">
                  {uploading ? 'Subiendo imagen…' : (previewUrl ? 'Imagen cargada' : 'Sin imagen')}
                </span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="label" htmlFor="whatsapp">WhatsApp</label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  inputMode="numeric"
                  pattern="[0-9\\s+()-]*"
                  value={form.whatsapp}
                  onChange={onChange}
                  placeholder="WhatsApp (solo números)"
                  className="form-control"
                />
              </div>
              <div className="space-y-2">
                <label className="label" htmlFor="email">Email (opcional)</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Email (opcional)"
                  className="form-control"
                />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="subsection-title">Presupuestos (opcional)</h3>
              <div className="space-y-2">
                {form.budgets.map((b, i) => (
                  <div key={i} className="grid md:grid-cols-[2fr_1fr_auto] gap-3 items-start">
                    <input
                      value={b.title}
                      onChange={(e) => updateBudgetLine(i, 'title', e.target.value)}
                      placeholder="Trabajo (p. ej. Instalación de toma)"
                      className="form-control"
                    />
                    <input
                      value={b.price}
                      onChange={(e) => updateBudgetLine(i, 'price', e.target.value)}
                      placeholder="Precio (p. ej. ARS 25.000 – 40.000)"
                      className="form-control"
                    />
                    <button type="button" onClick={() => removeBudgetLine(i)} className="btn btn-warning btn-sm">
                      Quitar
                    </button>
                  </div>
                ))}
                <button type="button" onClick={addBudgetLine} className="btn btn-outline-blue btn-sm">
                  Agregar línea
                </button>
              </div>
            </div>

            <div className="space-y-2">
              {err && <div className="rounded-md border border-red-200 bg-red-50 text-red-800 px-3 py-2">{err}</div>}
              {ok && <div className="rounded-md border border-green-200 bg-green-50 text-green-800 px-3 py-2">{ok}</div>}
            </div>

            <div>
              <button type="submit" className="btn btn-primary">Agregar</button>
            </div>
          </form>
        </section>

        {/* Servicios existentes */}
        <section className="card card-contrast card-accent-indigo">
          <div className="card-header">Servicios existentes</div>
          <div className="card-content list-card">
            {services.map((s, i) => (
              <div key={getId(s) ?? `${s.name || 'servicio'}-${i}`} className="list-item">
                <div>
                  <div className="item-title">{s.name}</div>
                  <div className="item-desc">{s.description}</div>
                </div>
                <div className="action-row">
                  <button
                    type="button"
                    className="btn btn-outline-blue btn-sm"
                    onClick={() => startEdit(s)}
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteService(getId(s))}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Modal de edición */}
        {editing && (
          <div className="modal-backdrop" onClick={cancelEdit}>
            <div
              ref={modalRef}
              className="modal modal-compact"
              role="dialog"
              aria-modal="true"
              aria-labelledby="edit-title"
              onClick={(e) => e.stopPropagation()}
              onKeyDown={onModalKeyDown}
              tabIndex={-1}
            >
              <div className="modal-header">
                <span id="edit-title">Editar servicio</span>
                <button type="button" className="btn btn-outline btn-sm" onClick={cancelEdit}>
                  Cerrar
                </button>
              </div>

              <div className="modal-content space-y-4">
                {/* Form layout: 2 columnas solo en pantallas grandes para no comprimir en modal estrecho */}
                <div className="grid lg:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="label" htmlFor="edit-name">Nombre</label>
                    <input
                      id="edit-name"
                      name="name"
                      type="text"
                      required
                      value={editForm.name}
                      onChange={onEditChange}
                      className="form-control"
                      placeholder="Nombre del servicio"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label" htmlFor="edit-email">Email (opcional)</label>
                    <input
                      id="edit-email"
                      name="email"
                      type="email"
                      value={editForm.email}
                      onChange={onEditChange}
                      className="form-control"
                      placeholder="Email"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="label" htmlFor="edit-whatsapp">WhatsApp</label>
                    <input
                      id="edit-whatsapp"
                      name="whatsapp"
                      type="tel"
                      inputMode="numeric"
                      pattern="[0-9\\s+()-]*"
                      value={editForm.whatsapp}
                      onChange={onEditChange}
                      className="form-control"
                      placeholder="WhatsApp (solo números)"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="label" htmlFor="edit-description">Descripción</label>
                  <input
                    id="edit-description"
                    name="description"
                    type="text"
                    value={editForm.description}
                    onChange={onEditChange}
                    className="form-control"
                    placeholder="Descripción breve"
                  />
                </div>

                <div className="grid md:grid-cols-[1fr_auto] items-center gap-4">
                  <div className="space-y-2">
                    <label className="label">Imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={onEditImageSelect}
                      className="form-control"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    {editPreviewUrl && (
                      <img
                        src={editPreviewUrl}
                        alt="Preview"
                        className="h-16 w-20 rounded object-cover border"
                      />
                    )}
                    <span className="small-muted">
                      {editUploading ? 'Subiendo imagen…' : (editPreviewUrl ? 'Imagen cargada' : 'Sin imagen')}
                    </span>
                  </div>
                </div>

                {/* Presupuestos (edición) con scroll propio para evitar desbordes */}
                <div className="space-y-3">
                  <h3 className="subsection-title">Presupuestos</h3>
                  <div className="section-scroll space-y-2">
                    {editForm.budgets.map((b, i) => (
                      <div key={i} className="grid md:grid-cols-[2fr_1fr_auto] gap-3 items-start">
                        <input
                          value={b.title}
                          onChange={(e) => updateEditBudgetLine(i, 'title', e.target.value)}
                          className="form-control"
                          placeholder="Trabajo"
                        />
                        <input
                          value={b.price}
                          onChange={(e) => updateEditBudgetLine(i, 'price', e.target.value)}
                          className="form-control"
                          placeholder="Precio"
                        />
                        <button
                          type="button"
                          className="btn btn-warning btn-sm"
                          onClick={() => removeEditBudgetLine(i)}
                        >
                          Quitar
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      className="btn btn-outline-blue btn-sm"
                      onClick={addEditBudgetLine}
                    >
                      Agregar línea
                    </button>
                  </div>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn btn-outline" onClick={cancelEdit}>
                  Cancelar
                </button>
                <button type="button" className="btn btn-primary" onClick={saveEdit}>
                  Guardar cambios
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
