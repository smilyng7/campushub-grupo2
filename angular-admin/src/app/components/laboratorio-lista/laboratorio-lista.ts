<<<<<<< HEAD

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  LaboratorioService,
  Laboratorio
} from '../../services/laboratorio.service';
=======
import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../services/catalogo.service';
import { Laboratorio } from '../../models/laboratorio';
>>>>>>> b0999aeb0886159fea736da4b63af67227a147ce

@Component({
  selector: 'app-laboratorio-lista',
  standalone: true,
<<<<<<< HEAD
  imports: [CommonModule, RouterModule],
=======
  imports: [CommonModule, RouterLink],
>>>>>>> b0999aeb0886159fea736da4b63af67227a147ce
  templateUrl: './laboratorio-lista.html',
  styleUrl: './laboratorio-lista.css',
})
export class LaboratorioLista implements OnInit {
<<<<<<< HEAD

  laboratorios: Laboratorio[] = [];

  constructor(
    private laboratorioService: LaboratorioService
  ) {}

  ngOnInit(): void {
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {
    this.laboratorioService.obtenerLaboratorios().subscribe({
      next: (data) => {
        this.laboratorios = data;
      },
      error: (error) => {
        console.error('Error al cargar laboratorios:', error);
      }
    });
  }

  eliminar(id: number): void {
    const confirmar = confirm(
      '¿Estás seguro de eliminar este laboratorio?'
    );

    if (confirmar) {
      this.laboratorioService.eliminarLaboratorio(id).subscribe({
        next: () => {
          alert('Laboratorio eliminado correctamente');
          this.cargarLaboratorios();
        },
        error: (error) => {
          console.error('Error al eliminar laboratorio:', error);
          alert('No se pudo eliminar el laboratorio');
        }
      });
    }
  }
}
=======
  private readonly catalogo = inject(CatalogoService);

  laboratorios: Laboratorio[] = [];
  error = '';

  ngOnInit(): void {
    this.catalogo.getLaboratorios().subscribe({
      next: (datos) => (this.laboratorios = datos),
      error: () => (this.error = 'No se pudieron cargar los laboratorios.'),
    });
  }
}
>>>>>>> b0999aeb0886159fea736da4b63af67227a147ce
