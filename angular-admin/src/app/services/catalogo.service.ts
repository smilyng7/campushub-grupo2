import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Laboratorio } from '../models/laboratorio';
import { Reserva } from '../models/reserva';

@Injectable({ providedIn: 'root' })
export class CatalogoService {
  private readonly http = inject(HttpClient);
  private readonly api = 'http://localhost:3000';

  getLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(`${this.api}/laboratorios`);
  }

  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.api}/reservas`);
  }
}