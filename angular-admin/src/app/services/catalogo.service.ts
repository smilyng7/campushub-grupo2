
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Laboratorio } from '../models/laboratorio';
import { Reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000';

  // LABORATORIOS

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.api}/laboratorios`);
  }

  getLaboratorio(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.api}/laboratorios/${id}`);
  }

  crearLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(
      `${this.api}/laboratorios`, laboratorio
    );
  }

  actualizarLaboratorio(
    id: number,
    laboratorio: Laboratorio
  ): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(
      `${this.api}/laboratorios/${id}`, laboratorio
    );
  }

  eliminarLaboratorio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/laboratorios/${id}`);
  }

  // RESERVAS

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.api}/reservas`);
  }

  getReserva(id: number): Observable<Reserva> {
    return this.http.get<Reserva>(`${this.api}/reservas/${id}`);
  }

  getReservasPorUsuario(usuarioId: number): Observable<Reserva[]> {
    const params = new HttpParams()
      .set('usuarioId', usuarioId);

    return this.http.get<Reserva[]>(
      `${this.api}/reservas`, { params }
    );
  }

  crearReserva(reserva: Reserva): Observable<Reserva> {
    return this.http.post<Reserva>(`${this.api}/reservas`, reserva);
  }

  actualizarEstadoReserva(
    id: number,
    estado: 'pendiente' | 'aprobada' | 'rechazada'
  ): Observable<Reserva> {
    return this.http.patch<Reserva>(
      `${this.api}/reservas/${id}`, { estado }
    );
  }

  eliminarReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/reservas/${id}`);
  }
}
