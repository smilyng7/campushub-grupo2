
import { CommonModule } from '@angular/common';
import { Component, OnInit, ChangeDetectorRef, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CatalogoService } from '../../services/catalogo.service';
import { Laboratorio } from '../../models/laboratorio';

@Component({
  selector: 'app-laboratorio-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './laboratorio-lista.html',
  styleUrl: './laboratorio-lista.css'
})
export class LaboratorioLista implements OnInit {

  private readonly catalogo = inject(CatalogoService);
  private readonly cdr = inject(ChangeDetectorRef);

  laboratorios: Laboratorio[] = [];
  cargando = false;
  error = '';

  ngOnInit(): void {
    console.log('Componente LaboratorioLista iniciado');
    this.cargarLaboratorios();
  }

  cargarLaboratorios(): void {

    this.cargando = true;
    this.error = '';

    this.catalogo.getLaboratorios().subscribe({

      next: (datos) => {
        console.log('Laboratorios recibidos:', datos);

        this.laboratorios = datos;
        this.cargando = false;

        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error API:', err);

        this.error = 'No se pudieron cargar los laboratorios.';
        this.cargando = false;

        this.cdr.detectChanges();
      }

    });
  }

  eliminarLaboratorio(id: number): void {

    if (!confirm('¿Deseas eliminar este laboratorio?')) {
      return;
    }

    this.catalogo.eliminarLaboratorio(id).subscribe({

      next: () => {
        this.laboratorios = this.laboratorios.filter(
          lab => lab.id !== id
        );

        alert('Laboratorio eliminado correctamente.');
        this.cdr.detectChanges();
      },

      error: (err) => {
        console.error('Error al eliminar:', err);
        alert('No se pudo eliminar el laboratorio.');
      }

    });
  }
}
