export type EstadoLaboratorio = 'disponible' | 'mantenimiento';

export interface Laboratorio {
  id: number;
  nombre: string;
  sede: string;
  capacidad: number;
  equipos: string[];
  estado: EstadoLaboratorio;
}