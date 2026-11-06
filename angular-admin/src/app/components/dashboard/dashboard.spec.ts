import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { Dashboard } from './dashboard';
import { CatalogoService } from '../../services/catalogo.service';
import { Laboratorio } from '../../models/laboratorio';
import { Reserva } from '../../models/reserva';

describe('Dashboard', () => {
  let component: Dashboard;
  let fixture: ComponentFixture<Dashboard>;

  const initialLaboratorios: Laboratorio[] = [
    { id: 1, nombre: 'Lab 1', sede: 'Lima', capacidad: 20, equipos: [], estado: 'disponible' },
    { id: 2, nombre: 'Lab 2', sede: 'Lima', capacidad: 20, equipos: [], estado: 'mantenimiento' }
  ];

  const initialReservas: Reserva[] = [
    { id: 1, codigo: 'RES-0001', laboratorioId: 1, usuarioId: 1, fecha: '2026-11-20', horaInicio: '08:00', horaFin: '10:00', motivo: 'Test', estado: 'aprobada' }
  ];

  const mockCatalogoService = {
    laboratorios$: new BehaviorSubject<Laboratorio[]>(initialLaboratorios),
    reservas$: new BehaviorSubject<Reserva[]>(initialReservas),
    getLaboratorios: () => of(initialLaboratorios),
    getReservas: () => of(initialReservas)
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Dashboard],
      providers: [
        provideRouter([]),
        { provide: CatalogoService, useValue: mockCatalogoService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Dashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should calculate laboratorio statistics correctly', () => {
    expect(component.totalLaboratorios).toBe(2);
    expect(component.laboratoriosDisponibles).toBe(1);
    expect(component.laboratoriosMantenimiento).toBe(1);
  });

  it('should calculate reservas statistics correctly', () => {
    expect(component.totalReservas).toBe(1);
    expect(component.reservasAprobadas).toBe(1);
    expect(component.reservasPendientes).toBe(0);
    expect(component.reservasRechazadas).toBe(0);
  });
});
