import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Reserva } from '../models/reserva';

@Injectable({
    providedIn: 'root'
})
export class ReservaService {
    private apiUrl = 'http://localhost:3000/reservas';

    constructor(private http: HttpClient) { }

    // GET: Obtener todas las reservas
    obtenerReservas(): Observable<Reserva[]> {
        return this.http.get<Reserva[]>(this.apiUrl);
    }

    // POST: Crear una reserva
    crearReserva(reserva: Omit<Reserva, 'id'>): Observable<Reserva> {
        return this.http.post<Reserva>(this.apiUrl, reserva);
    }

    // DELETE: Eliminar una reserva por ID
    eliminarReserva(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}