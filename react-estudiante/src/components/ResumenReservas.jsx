import { useEffect } from 'react';
import { useRequest } from 'alova/client';
import { obtenerResumen } from '../services/resumenAlova';

export default function ResumenReservas({ usuarioId, revision }) {
  const { data, loading, error, send } = useRequest(() => obtenerResumen(usuarioId), {
    immediate: false,
    force: ({ args }) => Boolean(args[0]),
  });
  useEffect(() => {
    // Al actualizar el historial o cancelar, consultar datos frescos.
    send(revision > 0).catch(() => {});
  }, [usuarioId, revision, send]);

  return (
    <section className="card card-body mb-4" aria-label="Resumen de reservas">
      <div className="d-flex justify-content-between align-items-center gap-2 mb-3">
        <h2 className="h5 mb-0">Resumen por estado</h2>
        <button type="button" className="btn btn-outline-primary btn-sm"
          disabled={loading} onClick={() => send(true).catch(() => {})}>
          Actualizar resumen
        </button>
      </div>
      {loading && <p role="status">Cargando resumen...</p>}
      {error && <p className="alert alert-danger" role="alert">
        No se pudo cargar el resumen. Comprueba el API y vuelve a actualizar.
      </p>}
      {!loading && !error && data && (
        <div className="d-flex flex-wrap gap-4">
          <span>Pendientes <strong>{data.pendiente}</strong></span>
          <span>Aprobadas <strong>{data.aprobada}</strong></span>
          <span>Rechazadas <strong>{data.rechazada}</strong></span>
          {data.pendiente + data.aprobada + data.rechazada === 0
            && <p className="mb-0">Todavía no tienes reservas para resumir.</p>}
        </div>
      )}
    </section>
  );
}
