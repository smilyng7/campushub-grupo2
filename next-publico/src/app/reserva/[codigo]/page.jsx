import Link from 'next/link';

const API_URL = 'http://localhost:3000';

export async function generateMetadata({ params }) {
    const { codigo } = await params;
    return {
        title: `Reserva ${codigo} | CampusHub`,
        description: `Consulta pública del estado de la reserva ${codigo} en CampusHub.`,
    };
}

async function buscarReservaPorCodigo(codigo) {
    const res = await fetch(`${API_URL}/reservas`, { cache: 'no-store' });
    if (!res.ok) {
        return null;
    }
    const reservas = await res.json();
    return (
        reservas.find(
            (item) => String(item.codigo).toLowerCase() === String(codigo).toLowerCase(),
        ) || null
    );
}

export default async function ConsultaReservaPage({ params }) {
    const { codigo } = await params;
    const reserva = await buscarReservaPorCodigo(codigo);

    return (
        <main className="mx-auto max-w-2xl p-6 space-y-6">
            <Link href="/" className="text-sm text-blue-600 underline">
                ← Volver al inicio
            </Link>

            {!reserva ? (
                <section className="rounded border border-red-300 bg-red-50 p-5 space-y-2">
                    <h1 className="text-xl font-bold text-red-800">Reserva no encontrada</h1>
                    <p className="text-sm text-red-700">
                        No se encontró ninguna reserva con el código <strong>{codigo}</strong>.
                    </p>
                </section>
            ) : (
                <section className="rounded border p-5 space-y-2">
                    <h1 className="text-xl font-bold">Reserva {reserva.codigo}</h1>
                    <p><strong>Estado:</strong> {reserva.estado}</p>
                    <p><strong>Fecha:</strong> {reserva.fecha}</p>
                    <p><strong>Horario:</strong> {reserva.horaInicio} - {reserva.horaFin}</p>
                    <p><strong>Motivo:</strong> {reserva.motivo}</p>
                </section>
            )}
        </main>
    );
}