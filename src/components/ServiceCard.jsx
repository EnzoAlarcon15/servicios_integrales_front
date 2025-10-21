export default function ServiceCard({ service, onSelect }) {
    const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    const initial = service.name?.[0]?.toUpperCase() || 'S';
    const fallback = `https://placehold.co/96x96?text=${initial}`;
    const imageUrl = service.image
        ? (service.image.startsWith('http') ? service.image : `${API_BASE}${service.image}`)
        : fallback;

    const phone = (service.whatsapp || '').replace(/\D/g, '');
    const waUrl = phone
        ? `https://wa.me/${phone}?text=${encodeURIComponent(`Hola ${service.name}, vi tu servicio y me gustaría consultar.`)}`
        : null;

    return (
        <div
            role="button"
            tabIndex={0}
            onClick={() => onSelect?.(service)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSelect?.(service); }}
            className="group rounded-xl border bg-white p-5 shadow-sm hover:shadow-md transition cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <img
                    src={imageUrl}
                    alt={service.name || 'Servicio'}
                    onError={(e) => { e.currentTarget.src = fallback; }}
                    className="h-16 w-16 rounded-lg object-cover bg-slate-100"
                />
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-slate-900">{service.name}</h3>
                    <p className="text-slate-600 mt-1">{service.description}</p>
                    <div className="mt-4 flex gap-2">
                        {waUrl && (
                            <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 rounded-md bg-green-600 px-3 py-2 text-white hover:bg-green-700"
                                onClick={(e) => e.stopPropagation()}
                            >
                                WhatsApp
                            </a>
                        )}
                        {service.email && (
                            <a
                                href={`mailto:${service.email}`}
                                className="inline-flex items-center gap-2 rounded-md bg-slate-900 px-3 py-2 text-white hover:bg-slate-800"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Email
                            </a>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}