import React from 'react';

function getSampleBudgets(name = '') {
  const n = name.toLowerCase();
  if (n.includes('electric')) {
    return [
      { title: 'Diagnóstico de circuito', price: 'ARS 25.000 – 40.000' },
      { title: 'Instalación de toma corriente', price: 'ARS 15.000 – 30.000' },
      { title: 'Colocación de disyuntor diferencial', price: 'ARS 35.000 – 70.000' },
    ];
  }
  if (n.includes('gas') || n.includes('gasista')) {
    return [
      { title: 'Revisión de pérdidas', price: 'ARS 30.000 – 60.000' },
      { title: 'Instalación de cocina', price: 'ARS 40.000 – 80.000' },
      { title: 'Cambio de flexible', price: 'ARS 10.000 – 20.000' },
    ];
  }
  if (n.includes('plom') || n.includes('sanit')) {
    return [
      { title: 'Destape de cañería', price: 'ARS 35.000 – 70.000' },
      { title: 'Cambio de grifería', price: 'ARS 15.000 – 30.000' },
      { title: 'Reparación de pérdida', price: 'ARS 20.000 – 45.000' },
    ];
  }
  if (n.includes('pint')) {
    return [
      { title: 'Pintura habitación (20 m²)', price: 'ARS 60.000 – 120.000' },
      { title: 'Impermeabilización de techo', price: 'ARS 90.000 – 180.000' },
      { title: 'Reparación de paredes', price: 'ARS 25.000 – 50.000' },
    ];
  }
  return [
    { title: 'Consulta y diagnóstico', price: 'ARS 20.000 – 40.000' },
    { title: 'Servicio estándar', price: 'ARS 40.000 – 80.000' },
    { title: 'Servicio premium', price: 'ARS 80.000 – 150.000' },
  ];
}

export default function ServiceDetailModal({ service, onClose }) {
  if (!service) return null;
  const API_BASE = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' ? window.location.origin : '');
  const initial = service.name?.[0]?.toUpperCase() || 'S';
  const fallback = `https://placehold.co/320x200?text=${initial}`;
  const imageUrl = service.image
      ? (service.image.startsWith('http') ? service.image : `${API_BASE}${service.image}`)
      : fallback;
  const phone = (service.whatsapp || '').replace(/\D/g, '');
  const waUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hola ${service.name}, me gustaría consultar un presupuesto.`)}`
    : null;

  const budgets = getSampleBudgets(service.name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/35" onClick={onClose} />
      <div className="relative z-10 w-[95%] max-w-2xl card">
        <div className="flex items-start gap-4 p-6 border-b">
          <img
            src={imageUrl}
            alt={service.name || 'Servicio'}
            onError={(e) => { e.currentTarget.src = fallback; }}
            className="h-24 w-32 rounded-lg object-cover bg-slate-100 border border-slate-200"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-slate-900">{service.name}</h3>
            <p className="muted-text mt-1">{service.description}</p>
          </div>
          <button type="button" onClick={onClose} className="btn-outline">Cerrar</button>
        </div>

        <div className="p-6 space-y-4">
          {/* Presupuestos ejemplo o detalle adicional */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {budgets.map((b, i) => (
              <div key={i} className="rounded-lg border p-3">
                <div className="font-medium text-slate-900">{b.title}</div>
                <div className="text-slate-600">{b.price}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-500 mt-3">
            Los valores son orientativos y pueden variar según diagnóstico y materiales.
          </p>
        </div>
      </div>
    </div>
  );
}