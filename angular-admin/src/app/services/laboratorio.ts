
import { Injectable } from '@angular/core';

export interface Laboratorio {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {

  private laboratorios: Laboratorio[] = [
    {
      id: 1,
      nombre: 'Laboratorio Clínico San Juan',
      direccion: 'Av. Principal 123',
      telefono: '987654321',
      estado: 'Activo'
    },
    {
      id: 2,
      nombre: 'Laboratorio Médico Central',
      direccion: 'Jr. Lima 456',
      telefono: '912345678',
      estado: 'Activo'
    },
    {
      id: 3,
      nombre: 'Laboratorio Vida',
      direccion: 'Av. Perú 789',
      telefono: '999888777',
      estado: 'Inactivo'
    }
  ];

  obtenerLaboratorios(): Laboratorio[] {
    return this.laboratorios;
  }

  agregarLaboratorio(laboratorio: Omit<Laboratorio, 'id'>): void {
    const nuevoLaboratorio: Laboratorio = {
      id: Math.max(0, ...this.laboratorios.map(l => l.id)) + 1,
      ...laboratorio
    };

    this.laboratorios.push(nuevoLaboratorio);
  }

  eliminarLaboratorio(id: number): void {
    this.laboratorios = this.laboratorios.filter(
      laboratorio => laboratorio.id !== id
    );
  }
}
