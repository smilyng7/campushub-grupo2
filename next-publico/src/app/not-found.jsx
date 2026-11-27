import Link from 'next/link';
export default function NoEncontrado() {
  return <main className="mx-auto max-w-2xl space-y-4 p-6">
    <h1 className="text-2xl font-bold">Página o laboratorio no encontrado</h1>
    <p>El recurso solicitado no existe. Puedes consultar el catálogo actualizado.</p>
    <Link className="text-blue-700 underline" href="/laboratorios">Volver al catálogo</Link>
  </main>;
}
