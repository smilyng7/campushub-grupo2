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

  ngOnInit(): void {
    this.cargarReservas();
  }

  cargarReservas(): void {
    this.cargando.set(true);
    this.error.set('');

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
        },
        error: (err) => console.error('Error al eliminar reserva:', err)
      });
    }
  }
}