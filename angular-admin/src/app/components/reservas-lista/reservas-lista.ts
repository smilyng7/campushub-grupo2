import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { CatalogoService } from '../../services/catalogo.service';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-reservas-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-lista.html',
  styleUrl: './reservas-lista.css',
})
export class ReservasLista implements OnInit {
  private readonly catalogo = inject(CatalogoService);

  reservas: Reserva[] = [];
  error = '';

  ngOnInit(): void {
    this.catalogo.getReservas().subscribe({
      next: (datos) => (this.reservas = datos),
      error: () => (this.error = 'No se pudieron cargar las reservas.'),
    });
  }
}