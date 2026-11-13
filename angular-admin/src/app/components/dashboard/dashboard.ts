import { Component, OnInit, OnDestroy, ChangeDetectorRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subject, timer } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CatalogoService } from '../../services/catalogo.service';
import { Laboratorio } from '../../models/laboratorio';
import { Reserva } from '../../models/reserva';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit, OnDestroy {

  private readonly catalogo = inject(CatalogoService);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroy$ = new Subject<void>();

  totalLaboratorios = 0;
  laboratoriosDisponibles = 0;
  laboratoriosMantenimiento = 0;

  totalReservas = 0;
  reservasPendientes = 0;
  reservasAprobadas = 0;
  reservasRechazadas = 0;

  ngOnInit(): void {
    // 1. Suscripción reactiva en tiempo real al estado del servicio compartido
    this.catalogo.laboratorios$
      .pipe(takeUntil(this.destroy$))
      .subscribe((laboratorios) => {
        if (laboratorios && laboratorios.length > 0) {
          this.calcularEstadisticasLaboratorios(laboratorios);
        }
      });

    this.catalogo.reservas$
      .pipe(takeUntil(this.destroy$))
      .subscribe((reservas) => {
        if (reservas && reservas.length > 0) {
          this.calcularEstadisticasReservas(reservas);
        }
      });

    // 2. Carga inicial desde la API
    this.cargarDatos();

    // 3. Sincronización automática periódica en segundo plano cada 3 segundos
    // para reflejar cambios externos automáticamente sin intervención del usuario
    timer(3000, 3000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.cargarDatos();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  cargarDatos(): void {
    this.catalogo.getLaboratorios().subscribe({
      next: (laboratorios) => {
        this.calcularEstadisticasLaboratorios(laboratorios);
      },
      error: (err) => {
        console.error('Error al sincronizar laboratorios en dashboard:', err);
      }
    });

    this.catalogo.getReservas().subscribe({
      next: (reservas) => {
        this.calcularEstadisticasReservas(reservas);
      },
      error: (err) => {
        console.error('Error al sincronizar reservas en dashboard:', err);
      }
    });
  }

  private calcularEstadisticasLaboratorios(laboratorios: Laboratorio[]): void {
    this.totalLaboratorios = laboratorios.length;
    this.laboratoriosDisponibles = laboratorios.filter(
      lab => lab.estado?.toLowerCase() === 'disponible'
    ).length;
    this.laboratoriosMantenimiento = laboratorios.filter(
      lab => lab.estado?.toLowerCase() === 'mantenimiento'
    ).length;
    this.cdr.detectChanges();
  }

  private calcularEstadisticasReservas(reservas: Reserva[]): void {
    this.totalReservas = reservas.length;
    this.reservasPendientes = reservas.filter(
      r => r.estado?.toLowerCase() === 'pendiente'
    ).length;
    this.reservasAprobadas = reservas.filter(
      r => r.estado?.toLowerCase() === 'aprobada'
    ).length;
    this.reservasRechazadas = reservas.filter(
      r => r.estado?.toLowerCase() === 'rechazada'
    ).length;
    this.cdr.detectChanges();
  }

  get porcentajePendientes(): number {
    return this.totalReservas > 0 ? (this.reservasPendientes / this.totalReservas) * 100 : 0;
  }

  get porcentajeAprobadas(): number {
    return this.totalReservas > 0 ? (this.reservasAprobadas / this.totalReservas) * 100 : 0;
  }

  get porcentajeRechazadas(): number {
    return this.totalReservas > 0 ? (this.reservasRechazadas / this.totalReservas) * 100 : 0;
  }

}
