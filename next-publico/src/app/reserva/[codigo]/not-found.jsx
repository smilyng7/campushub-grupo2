import Link from 'next/link';

export default function ReservaNotFound() {
    return (
        <main className="mx-auto max-w-2xl space-y-4 p-6">
            <section className="space-y-2 rounded border border-red-300 bg-red-50 p-5">
                <h1 className="text-xl font-bold text-red-800">Reserva no encontrada</h1>
                <p className="text-sm text-red-700">
                    No se encontró una reserva con ese código. Verifica el código e inténtalo nuevamente.
                </p>
            </section>
            <Link href="/" className="text-sm text-blue-600 underline">
                Volver al inicio
            </Link>
        </main>
    );
}
