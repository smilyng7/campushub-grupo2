
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Laboratorio {
  id?: number;
  nombre: string;
  sede: string;
  capacidad: number;
  equipos: string[];
  estado: string;
}

@Injectable({
  providedIn: 'root'
})
export class LaboratorioService {

  private apiUrl = 'http://localhost:3000/laboratorios';

  constructor(private http: HttpClient) { }

  obtenerLaboratorios(): Observable<Laboratorio[]> {
    return this.http.get<Laboratorio[]>(this.apiUrl);
  }

  obtenerLaboratorio(id: number): Observable<Laboratorio> {
    return this.http.get<Laboratorio>(`${this.apiUrl}/${id}`);
  }

  crearLaboratorio(laboratorio: Laboratorio): Observable<Laboratorio> {
    return this.http.post<Laboratorio>(this.apiUrl, laboratorio);
  }

  actualizarLaboratorio(
    id: number,
    laboratorio: Laboratorio
  ): Observable<Laboratorio> {
    return this.http.put<Laboratorio>(
      `${this.apiUrl}/${id}`,
      laboratorio
    );
  }

  eliminarLaboratorio(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
