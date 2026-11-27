import { Suspense } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

const API_URL = 'http://localhost:3000';

function obtenerRangoSemana(fecha = new Date()) {
    const partesFecha = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Lima',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).formatToParts(fecha);
    const anio = Number(partesFecha.find((parte) => parte.type === 'year').value);
    const mes = Number(partesFecha.find((parte) => parte.type === 'month').value);
    const dia = Number(partesFecha.find((parte) => parte.type === 'day').value);
    const hoy = new Date(Date.UTC(anio, mes - 1, dia));
    const inicio = new Date(hoy);
    inicio.setUTCDate(hoy.getUTCDate() - ((hoy.getUTCDay() + 6) % 7));
    const fin = new Date(inicio);
    fin.setUTCDate(inicio.getUTCDate() + 6);

    return {
        inicio: inicio.toISOString().slice(0, 10),
        fin: fin.toISOString().slice(0, 10),
    };
}

async function obtenerDetalle(id) {
    const [labRes, reservasRes] = await Promise.all([
        fetch(`${API_URL}/laboratorios/${id}`, { cache: 'no-store' }),
        fetch(`${API_URL}/reservas?laboratorioId=${id}`, { cache: 'no-store' }),
    ]);

    if (!labRes.ok) {
        return null;
    }

    const laboratorio = await labRes.json();
    if (!reservasRes.ok) {
        throw new Error(`No se pudieron cargar las reservas (${reservasRes.status}).`);
    }

    const reservas = await reservasRes.json();
    const { inicio, fin } = obtenerRangoSemana();
    const aprobadas = reservas.filter(
        (r) => r.estado === 'aprobada' && r.fecha >= inicio && r.fecha <= fin,
    );

    return { laboratorio, aprobadas };
}

export async function generateMetadata({ params }) {
    const { id } = await params;
    return {
        title: `Laboratorio ${id}`,
        description: `Consulta los datos y las reservas aprobadas de esta semana para el laboratorio ${id} en CampusHub.`,
    };
}

async function DetalleLaboratorioContenido({ params }) {
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
                <h2 className="text-xl font-semibold">Reservas aprobadas esta semana</h2>
                {aprobadas.length === 0 ? (
                    <p>No hay reservas aprobadas para este laboratorio durante esta semana.</p>
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

export default function DetalleLaboratorioPage({ params }) {
    return (
        <Suspense fallback={<p className="p-6">Cargando información del laboratorio...</p>}>
            <DetalleLaboratorioContenido params={params} />
        </Suspense>
    );
}