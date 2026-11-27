import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ReservaService } from './reserva.service';
describe('Contrato HTTP de reservas', () => {
  it('aprueba con PATCH y entrega la respuesta del API', () => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    const http = TestBed.inject(HttpTestingController);
    let estado = '';
    TestBed.inject(ReservaService).actualizarEstado(21, 'aprobada').subscribe(r => estado = r.estado);
    const request = http.expectOne('http://localhost:3000/reservas/21');
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ estado: 'aprobada' });
    request.flush({ id: 21, estado: 'aprobada' });
    expect(estado).toBe('aprobada'); http.verify();
  });
});
