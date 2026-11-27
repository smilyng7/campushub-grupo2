'use client';
export default function ErrorConsulta({ reset }) {
  return <main className="mx-auto max-w-2xl space-y-4 p-6" role="alert">
    <h1 className="text-2xl font-bold">No se pudo consultar la información</h1>
    <p>Comprueba que el API esté disponible y vuelve a intentarlo.</p>
    <button className="rounded bg-blue-700 px-4 py-2 text-white" onClick={() => reset()}>Reintentar</button>
  </main>;
}
