import Link from 'next/link';

const API_URL = 'http://localhost:3000';

export const metadata = {
    title: 'Catálogo Público de Laboratorios | CampusHub',
    description: 'Consulta la disponibilidad, sede, capacidad y equipamiento de los laboratorios del campus.',
};

async function obtenerLaboratorios() {
    const res = await fetch(`${API_URL}/laboratorios`, { cache: 'no-store' });
    if (!res.ok) {
        return [];
    }
    return res.json();
}

export default async function LaboratoriosPage() {
    const laboratorios = await obtenerLaboratorios();

    return (
        <main className="mx-auto max-w-5xl p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Laboratorios disponibles</h1>
                    <p className="text-sm text-gray-600">Vista pública renderizada en el servidor (SSR)</p>
                </div>
                <Link href="/" className="text-sm text-blue-600 underline">
                    Inicio
                </Link>
            </div>

            {laboratorios.length === 0 ? (
                <p>No hay laboratorios registrados o el API en el puerto 3000 no está activo.</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2">
                    {laboratorios.map((lab) => (
                        <article key={lab.id} className="rounded border p-4 space-y-2">
                            <h2 className="text-lg font-semibold">{lab.nombre}</h2>
                            <p className="text-sm">Sede: {lab.sede} — Capacidad: {lab.capacidad}</p>
                            <p className="text-sm">Estado: {lab.estado}</p>
                            <Link
                                href={`/laboratorios/${lab.id}`}
                                className="inline-block text-sm text-blue-600 underline pt-1"
                            >
                                Ver detalle y reservas aprobadas →
                            </Link>
                        </article>
                    ))}
                </div>
            )}
        </main>
    );
}