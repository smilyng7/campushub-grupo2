
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
  error = '';

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
        this.error = '';
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudieron cargar los laboratorios.';
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
          alert('Laboratorio eliminado correctamente.');
          this.cargarLaboratorios();
        },
        error: (err) => {
          console.error(err);
          alert('No se pudo eliminar el laboratorio.');
        }
      });
    }
  }
}
