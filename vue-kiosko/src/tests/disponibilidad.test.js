import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import App from '../App.vue';
import { fechaEnLima } from '../../../core-js/disponibilidad.js';
let wrapper;
const labs = [
  { id: 1, nombre: 'Lab Norte', sede: 'Norte', capacidad: 20, estado: 'disponible' },
  { id: 2, nombre: 'Lab Sur', sede: 'Sur', capacidad: 20, estado: 'disponible' },
];
let reservas;
const mockFetch = vi.fn(async url => ({ ok: true, json: async () => url.includes('/laboratorios') ? labs : reservas }));
beforeEach(() => {
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-27T15:00:00Z'));
  reservas = [{ laboratorioId: 1, codigo: 'RES-0021', fecha: fechaEnLima(), horaInicio: '08:00', horaFin: '09:00', estado: 'pendiente' }];
  mockFetch.mockClear();
  vi.stubGlobal('fetch', mockFetch);
});
afterEach(() => { wrapper?.unmount(); vi.unstubAllGlobals(); vi.useRealTimers(); });
describe('Kiosko Vue', () => {
  it('carga datos, filtra por sede y comunica la selección mediante emit', async () => {
    wrapper = mount(App); await flushPromises();
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
    await wrapper.find('button.pendiente').trigger('click');
    expect(wrapper.find('.detalle').text()).toContain('RES-0021');
    await wrapper.find('select').setValue('Sur');
    expect(wrapper.findAll('tbody tr')).toHaveLength(1);
    expect(wrapper.find('tbody').text()).toContain('Lab Sur');
    expect(wrapper.find('.detalle').exists()).toBe(false);
  });
  it('recibe una aprobación a los 30 segundos y limpia el intervalo al salir', async () => {
    wrapper = mount(App); await flushPromises();
    expect(wrapper.find('button.pendiente').exists()).toBe(true);
    reservas = [{ ...reservas[0], estado: 'aprobada' }];
    await vi.advanceTimersByTimeAsync(30000); await flushPromises();
    expect(wrapper.find('button.ocupada').exists()).toBe(true);
    expect(mockFetch).toHaveBeenCalledTimes(4);
    wrapper.unmount(); wrapper = null;
    await vi.advanceTimersByTimeAsync(60000);
    expect(mockFetch).toHaveBeenCalledTimes(4);
  });
  it('muestra error y recupera los datos al reintentar', async () => {
    mockFetch.mockRejectedValueOnce(new Error('Sin conexión'));
    wrapper = mount(App); await flushPromises();
    expect(wrapper.find('[role="alert"]').text()).toContain('Sin conexión');
    await wrapper.find('[role="alert"] button').trigger('click'); await flushPromises();
    expect(wrapper.find('[role="alert"]').exists()).toBe(false);
    expect(wrapper.findAll('tbody tr')).toHaveLength(2);
  });
  it('muestra vacío cuando no hay laboratorios', async () => {
    mockFetch.mockResolvedValueOnce({ ok: true, json: async () => [] });
    wrapper = mount(App); await flushPromises();
    expect(wrapper.find('.vacio').text()).toContain('No hay laboratorios');
  });
});
