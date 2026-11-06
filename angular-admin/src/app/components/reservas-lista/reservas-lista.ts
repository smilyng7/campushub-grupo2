
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';

import { CatalogoService } from '../../services/catalogo.service';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-reservas-lista',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reservas-lista.html',
  styleUrl: './reservas-lista.css'
})
export class ReservasLista implements OnInit {

  private readonly catalogo = inject(CatalogoService);
  private readonly cdr = inject(ChangeDetectorRef);

  reservas: Reserva[] = [];
  cargando = false;
  error = '';

  ngOnInit(): void {
    console.log('Componente ReservasLista iniciado');
    this.cargarReservas();
  }

  cargarReservas(): void {

    this.cargando = true;
    this.error = '';

    console.log('Consultando reservas...');

    this.catalogo.getReservas().subscribe({

      next: (datos) => {

        console.log('RESERVAS RECIBIDAS:', datos);

        this.reservas = datos;
        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (err) => {

        console.error('Error al cargar reservas:', err);

        this.error = 'No se pudieron cargar las reservas.';

        this.cargando = false;

        this.cdr.detectChanges();
      }

    });
  }

}
