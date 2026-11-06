import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-reservas-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-lista.html',
  styleUrls: ['./reservas-lista.css']
})
export class ReservasLista implements OnInit {
  reservas: Reserva[] = [];
  cargando = true;
  error = '';

  constructor(private reservaService: ReservaService) { }

  ngOnInit(): void {
    this.cargarReservas();
  }

  // Cargar lista de reservas desde el backend simulado
  cargarReservas(): void {
    this.cargando = true;
    this.reservaService.obtenerReservas().subscribe({
      next: (datos) => {
        this.reservas = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.error = 'No se pudieron cargar las reservas.';
        this.cargando = false;
      }
    });
  }

  // Eliminar reserva mediante el método DELETE
  eliminar(id?: number): void {
    if (!id) return;
    if (confirm('¿Estás segura de eliminar esta reserva?')) {
      this.reservaService.eliminarReserva(id).subscribe({
        next: () => {
          this.reservas = this.reservas.filter(r => r.id !== id);
        },
        error: (err) => console.error('Error al eliminar reserva:', err)
      });
    }
  }
}