import Link from "next/link";

export const metadata = {
  title: "Portal público",
  description:
    "Consulta el catálogo público de laboratorios y el estado de tus reservas en CampusHub.",
};

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col justify-center gap-6 p-6">
      <h1 className="text-3xl font-bold">CampusHub</h1>
      <p className="text-gray-700">
        Consulta los laboratorios del campus y revisa el estado de tus reservas.
      </p>
      <div className="flex flex-wrap gap-4">
        <Link
          href="/laboratorios"
          className="rounded bg-blue-700 px-4 py-2 font-semibold text-white"
        >
          Ver laboratorios
        </Link>
        <Link href="/reserva/RES-0001" className="rounded border px-4 py-2">
          Consultar una reserva
        </Link>
      </div>
    </main>
  );
}
