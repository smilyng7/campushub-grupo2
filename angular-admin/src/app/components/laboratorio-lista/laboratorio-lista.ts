
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import {
  LaboratorioService,
  Laboratorio
} from '../../services/laboratorio.service';

@Component({
  selector: 'app-laboratorio-lista',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './laboratorio-lista.html',
  styleUrl: './laboratorio-lista.css',
})
export class LaboratorioLista implements OnInit {

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
