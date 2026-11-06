import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CatalogoService } from '../../services/catalogo.service';
import { Laboratorio } from '../../models/laboratorio';

@Component({
  selector: 'app-laboratorio-lista',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './laboratorio-lista.html',
  styleUrl: './laboratorio-lista.css',
})
export class LaboratorioLista implements OnInit {
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