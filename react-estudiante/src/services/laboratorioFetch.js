const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function solicitarJson(ruta, { signal } = {}) {
  const response = await fetch(`${API_URL}${ruta}`, { signal });

  if (!response.ok) {
    const cuerpoError = await response.json().catch(() => null);
    const error = new Error(
      cuerpoError?.mensaje || `Error en la peticion (${response.status})`
    );
    error.status = response.status;
    throw error;
  }

  return response.json();
}

export function obtenerLaboratorios(opciones = {}) {
  return solicitarJson('/laboratorios', opciones);
}

export function obtenerLaboratorioPorId(id, opciones = {}) {
  return solicitarJson(`/laboratorios/${id}`, opciones);
}

export function obtenerReservasPorLaboratorio(laboratorioId, opciones = {}) {
  return solicitarJson(`/reservas?laboratorioId=${laboratorioId}`, opciones);
}

