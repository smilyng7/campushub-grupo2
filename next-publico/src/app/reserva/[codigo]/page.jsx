import Link from 'next/link';
import ReservaNotFound from './not-found';

const API_URL = process.env.API_URL || 'http://localhost:3000';

export async function generateMetadata({ params }) {
    const { codigo } = await params;
    return {
        title: `Consulta de reserva ${codigo}`,
        description: `Consulta si la reserva ${codigo} fue aprobada, está pendiente o fue rechazada en CampusHub.`,
    };
}

async function buscarReservaPorCodigo(codigo) {
    const res = await fetch(`${API_URL}/reservas`, { cache: 'no-store' });
    if (!res.ok) {
        throw new Error(`No se pudieron consultar las reservas (${res.status}).`);
    }
    const reservas = await res.json();
    return (
        reservas.find(
            (item) => String(item.codigo).toLowerCase() === String(codigo).toLowerCase(),
        ) || null
    );
}

export default async function ConsultaReservaContenido({ params }) {
    const { codigo } = await params;
    const reserva = await buscarReservaPorCodigo(codigo);

    if (!reserva) {
        return <ReservaNotFound />;
    }

    return (
        <main className="mx-auto max-w-2xl p-6 space-y-6">
            <Link href="/" className="text-sm text-blue-600 underline">
                ← Volver al inicio
            </Link>

            <section className="rounded border p-5 space-y-2">
                <h1 className="text-xl font-bold">Reserva {reserva.codigo}</h1>
                <p><strong>Estado:</strong> {reserva.estado}</p>
                <p><strong>Fecha:</strong> {reserva.fecha}</p>
                <p><strong>Horario:</strong> {reserva.horaInicio} - {reserva.horaFin}</p>
                <p><strong>Motivo:</strong> {reserva.motivo}</p>
            </section>
        </main>
    );
}

