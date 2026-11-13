import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { EstadoLaboratorio, Laboratorio } from '../models/laboratorio';
import { Reserva } from '../models/reserva';

@Injectable({
  providedIn: 'root'
})
export class CatalogoService {

  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000';

  private readonly laboratoriosSubject = new BehaviorSubject<Laboratorio[]>([]);
  public readonly laboratorios$ = this.laboratoriosSubject.asObservable();

  private readonly reservasSubject = new BehaviorSubject<Reserva[]>([]);
  public readonly reservas$ = this.reservasSubject.asObservable();

  // LABORATORIOS

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.api}/laboratorios`).pipe(
      tap((laboratorios) => this.laboratoriosSubject.next(laboratorios))
    );
  }

  getLaboratorio(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.api}/laboratorios/${id}`);
  }

  crearLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(
      `${this.api}/laboratorios`, laboratorio
    ).pipe(
      tap((nuevo) => {
        const actuales = this.laboratoriosSubject.value;
        this.laboratoriosSubject.next([...actuales, nuevo]);
      })
    );
  }

  actualizarLaboratorio(
    id: number,
    laboratorio: Laboratorio
  ): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(
      `${this.api}/laboratorios/${id}`, laboratorio
    ).pipe(
      tap((actualizado) => {
        const actuales = this.laboratoriosSubject.value.map(l =>
          l.id === id ? { ...l, ...actualizado } : l
        );
        this.laboratoriosSubject.next(actuales);
      })
    );
  }

  actualizarEstadoLaboratorio(
    id: number,
    estado: EstadoLaboratorio
  ): Observable<Laboratorio> {
    return this.http.patch<Laboratorio>(
      `${this.api}/laboratorios/${id}`, { estado }
    ).pipe(
      tap((actualizado) => {
        const actuales = this.laboratoriosSubject.value.map(l =>
          l.id === id ? { ...l, estado: actualizado.estado } : l
        );
        this.laboratoriosSubject.next(actuales);
      })
    );
  }

  eliminarLaboratorio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/laboratorios/${id}`).pipe(
      tap(() => {
        const actuales = this.laboratoriosSubject.value.filter(l => l.id !== id);
        this.laboratoriosSubject.next(actuales);
      })
    );
  }

  // RESERVAS

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.api}/reservas`).pipe(
      tap((reservas) => this.reservasSubject.next(reservas))
    );
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
    return this.http.post<Reserva>(`${this.api}/reservas`, reserva).pipe(
      tap((nueva) => {
        const actuales = this.reservasSubject.value;
        this.reservasSubject.next([...actuales, nueva]);
      })
    );
  }

  actualizarEstadoReserva(
    id: number,
    estado: 'pendiente' | 'aprobada' | 'rechazada'
  ): Observable<Reserva> {
    return this.http.patch<Reserva>(
      `${this.api}/reservas/${id}`, { estado }
    ).pipe(
      tap((actualizada) => {
        const actuales = this.reservasSubject.value.map(r =>
          r.id === id ? { ...r, estado: actualizada.estado } : r
        );
        this.reservasSubject.next(actuales);
      })
    );
  }

  eliminarReserva(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/reservas/${id}`).pipe(
      tap(() => {
        const actuales = this.reservasSubject.value.filter(r => r.id !== id);
        this.reservasSubject.next(actuales);
      })
    );
  }
}
