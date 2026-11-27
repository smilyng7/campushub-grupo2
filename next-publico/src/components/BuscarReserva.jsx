'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
export default function BuscarReserva() {
  const [codigo, setCodigo] = useState('');
  const router = useRouter();
  return <form className="space-y-3 rounded border p-5" onSubmit={evento => {
    evento.preventDefault();
    router.push(`/reserva/${encodeURIComponent(codigo.trim().toUpperCase())}`);
  }}>
    <label className="block font-semibold" htmlFor="codigo">Consulta tu reserva</label>
    <input className="rounded border p-2" id="codigo" value={codigo} required pattern="[Rr][Ee][Ss]-[0-9]+"
      placeholder="RES-0001" title="Escribe RES- seguido del número de reserva"
      onChange={evento => setCodigo(evento.target.value)} />
    <button className="ml-3 rounded bg-blue-700 px-4 py-2 text-white" type="submit">Consultar</button>
  </form>;
}
