import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_URL = 'http://localhost:3000';

async function obtenerDetalle(id) {
    const [labRes, reservasRes] = await Promise.all([
        fetch(`${API_URL}/laboratorios/${id}`, { cache: 'no-store' }),
        fetch(`${API_URL}/reservas?laboratorioId=${id}`, { cache: 'no-store' }),
    ]);

    if (!labRes.ok) {
        return null;
    }

    const laboratorio = await labRes.json();
    const reservas = reservasRes.ok ? await reservasRes.json() : [];
    const aprobadas = reservas.filter((r) => r.estado === 'aprobada');

    return { laboratorio, aprobadas };
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    const data = await obtenerDetalle(id);

    if (!data) {
        return {
            title: 'Laboratorio no encontrado | CampusHub',
            description: 'El laboratorio solicitado no existe en el catálogo público.',
        };
    }

    return {
        title: `${data.laboratorio.nombre} (${data.laboratorio.sede}) | CampusHub`,
        description: `Capacidad ${data.laboratorio.capacidad}, estado ${data.laboratorio.estado} y reservas aprobadas.`,
    };
}

export default async function DetalleLaboratorioPage({ params }) {
    const { id } = await params;
    const data = await obtenerDetalle(id);

    if (!data) {
        notFound();
    }

    const { laboratorio, aprobadas } = data;

    return (
        <main className="mx-auto max-w-4xl p-6 space-y-6">
            <Link href="/laboratorios" className="text-blue-600 underline">
                ← Volver al catálogo público
            </Link>

            <section className="rounded border p-5 space-y-2">
                <h1 className="text-2xl font-bold">{laboratorio.nombre}</h1>
                <p>Sede: {laboratorio.sede} — Capacidad: {laboratorio.capacidad}</p>
                <p>Estado: {laboratorio.estado}</p>
                <p>Equipos: {(laboratorio.equipos || []).join(', ')}</p>
            </section>

            <section className="rounded border p-5 space-y-3">
                <h2 className="text-xl font-semibold">Reservas aprobadas</h2>
                {aprobadas.length === 0 ? (
                    <p>No hay reservas aprobadas registradas para este laboratorio.</p>
                ) : (
                    <ul className="list-disc pl-5 space-y-1">
                        {aprobadas.map((res) => (
                            <li key={res.id}>
                                <strong>{res.codigo}</strong> — {res.fecha} ({res.horaInicio} a {res.horaFin}) — {res.motivo}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </main>
    );
}