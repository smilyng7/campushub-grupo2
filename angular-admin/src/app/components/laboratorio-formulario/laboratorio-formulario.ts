import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { CatalogoService } from '../../services/catalogo.service';
import { Laboratorio } from '../../models/laboratorio';

@Component({
  selector: 'app-laboratorio-formulario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './laboratorio-formulario.html',
  styleUrl: './laboratorio-formulario.css',
})
export class LaboratorioFormulario implements OnInit {

  private readonly catalogo = inject(CatalogoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly cdr = inject(ChangeDetectorRef);

  laboratorio: Laboratorio = {
    nombre: '',
    sede: '',
    capacidad: 30,
    equipos: [],
    estado: 'disponible'
  };

  equiposTexto = '';
  editando = false;
  cargando = false;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.editando = true;
      this.cargando = true;

      this.catalogo
        .getLaboratorio(Number(id))
        .subscribe({
          next: (data) => {
            this.laboratorio = data;
            this.equiposTexto = data.equipos ? data.equipos.join(', ') : '';
            this.cargando = false;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Error al cargar laboratorio:', error);
            this.cargando = false;
            this.cdr.detectChanges();
            alert('No se pudo cargar el laboratorio.');
            this.router.navigate(['/laboratorios']);
          }
        });
    }
  }

  actualizarEquipos(): void {
    this.laboratorio.equipos = this.equiposTexto
      ? this.equiposTexto
          .split(',')
          .map(e => e.trim())
          .filter(e => e.length > 0)
      : [];
  }

  guardar(): void {
    this.actualizarEquipos();

    if (
      !this.laboratorio.nombre.trim() ||
      !this.laboratorio.sede.trim() ||
      this.laboratorio.capacidad <= 0 ||
      !Number.isFinite(this.laboratorio.capacidad)
    ) {
      alert('Completa todos los campos correctamente.');
      return;
    }

    const id = this.route.snapshot.paramMap.get('id');

    const operacion = id
      ? this.catalogo.actualizarLaboratorio(
          Number(id),
          this.laboratorio
        )
      : this.catalogo.crearLaboratorio(
          this.laboratorio
        );

    operacion.subscribe({
      next: () => {
        alert(
          this.editando
            ? '¡Laboratorio actualizado correctamente!'
            : '¡Laboratorio registrado correctamente!'
        );

        this.router.navigate(['/laboratorios']);
      },
      error: (error) => {
        console.error('Error al guardar laboratorio:', error);
        alert('No se pudo guardar el laboratorio. Verifica el servidor.');
      }
    });
  }

  cancelar(): void {
    this.router.navigate(['/laboratorios']);
  }
}
