
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import {
  LaboratorioService,
  Laboratorio
} from '../../services/laboratorio.service';

@Component({
  selector: 'app-laboratorio-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laboratorio-formulario.html',
  styleUrl: './laboratorio-formulario.css',
})
export class LaboratorioFormulario {

  laboratorio: Laboratorio = {
    nombre: '',
    direccion: '',
    telefono: '',
    estado: 'Activo'
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private laboratorioService: LaboratorioService
  ) {}

  guardar(): void {

    if (
      !this.laboratorio.nombre.trim() ||
      !this.laboratorio.direccion.trim() ||
      !this.laboratorio.telefono.trim()
    ) {
      alert('Completa todos los campos');
      return;
    }

    this.laboratorioService.crearLaboratorio(this.laboratorio).subscribe({
      next: () => {
        alert('¡Laboratorio registrado correctamente!');
        this.router.navigate(['/laboratorios']);
      },
      error: (error) => {
        console.error('Error al registrar laboratorio:', error);
        alert('No se pudo registrar el laboratorio. Verifica el servidor.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/laboratorios']);
  }
}
