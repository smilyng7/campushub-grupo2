import { createAlova, invalidateCache } from 'alova';
import adapterFetch from 'alova/fetch';
import ReactHook from 'alova/react';
import { reservasPorEstado } from '../../../core-js/estadisticas.js';

const alova = createAlova({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  statesHook: ReactHook,
  requestAdapter: adapterFetch(),
  timeout: 10000,
  responded: async respuesta => {
    if (!respuesta.ok) throw new Error('No se pudo consultar el resumen de reservas.');
    return respuesta.json();
  },
});

export function obtenerResumen(usuarioId) {
  return alova.Get('/reservas', {
    params: { usuarioId },
    cacheFor: 30000,
    transform: reservas => reservasPorEstado(reservas),
  });
}

export function invalidarResumen(usuarioId) {
  return invalidateCache(obtenerResumen(usuarioId));
}
