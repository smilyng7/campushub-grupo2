import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { vi } from 'vitest';
import { ReservasLista } from './reservas-lista';
import { ReservaService } from '../../services/reserva.service';
import { Reserva } from '../../models/reserva';

describe('ReservasLista', () => {
  let component: ReservasLista;
  let fixture: ComponentFixture<ReservasLista>;
  let reservaService: {
    obtenerReservas: ReturnType<typeof vi.fn>;
    actualizarEstado: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    reservaService = {
      obtenerReservas: vi.fn(() => of([])),
      actualizarEstado: vi.fn(),
    };
    await TestBed.configureTestingModule({
      imports: [ReservasLista],
      providers: [{ provide: ReservaService, useValue: reservaService }],
    }).compileComponents();

    fixture = TestBed.createComponent(ReservasLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('updates a pending reservation after the API approves it', () => {
    const pendiente: Reserva = {
      id: 21,
      codigo: 'RES-0021',
      laboratorioId: 1,
      usuarioId: 3,
      fecha: '2099-12-30',
      horaInicio: '08:00',
      horaFin: '09:00',
      motivo: 'Prueba',
      estado: 'pendiente',
    };
    const aprobada = { ...pendiente, estado: 'aprobada' as const };
    component.reservas.set([pendiente]);
    reservaService.actualizarEstado.mockReturnValue(of(aprobada));

    component.cambiarEstado(pendiente, 'aprobada');

    expect(reservaService.actualizarEstado).toHaveBeenCalledWith(21, 'aprobada');
    expect(component.reservas()[0].estado).toBe('aprobada');
  });
});
