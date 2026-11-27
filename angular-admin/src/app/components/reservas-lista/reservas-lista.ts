import { Component, OnInit, signal, inject } from '@angular/core';
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
  private readonly reservaService = inject(ReservaService);

  reservas = signal<Reserva[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string>('');
  errorAccion = signal<string>('');
  actualizandoId = signal<number | null>(null);

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando.set(true);
    this.error.set('');
    this.errorAccion.set('');

    this.reservaService.obtenerReservas().subscribe({
      next: (datos) => {
        this.reservas.set(datos);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
        this.error.set('No se pudieron cargar las reservas.');
        this.cargando.set(false);
      }
    });
  }

  eliminar(id?: number): void {
    if (!id) return;
    if (confirm('¿Estás segura de eliminar esta reserva?')) {
      this.reservaService.eliminarReserva(id).subscribe({
        next: () => {
          this.reservas.update(lista => lista.filter(r => r.id !== id));
          this.errorAccion.set('');
        },
        error: (err) => {
          console.error('Error al eliminar reserva:', err);
          this.errorAccion.set('No se pudo eliminar la reserva. Inténtalo nuevamente.');
        }
      });
    }
  }

  cambiarEstado(reserva: Reserva, estado: Reserva['estado']): void {
    if (!reserva.id || reserva.estado !== 'pendiente' || this.actualizandoId() !== null) return;
    this.errorAccion.set('');
    this.actualizandoId.set(reserva.id);
    this.reservaService.actualizarEstado(reserva.id, estado).subscribe({
      next: (actualizada) => {
        this.reservas.update(lista =>
          lista.map(item => item.id === actualizada.id ? actualizada : item)
        );
        this.actualizandoId.set(null);
      },
      error: (err) => {
        console.error('Error al actualizar estado de reserva:', err);
        this.errorAccion.set('No se pudo actualizar la reserva. Inténtalo nuevamente.');
        this.actualizandoId.set(null);
      }
    });
  }
}