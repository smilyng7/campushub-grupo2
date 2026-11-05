import { Routes } from '@angular/router';

import { Dashboard } from './components/dashboard/dashboard';
import { LaboratorioLista } from './components/laboratorio-lista/laboratorio-lista';
import { LaboratorioDetalle } from './components/laboratorio-detalle/laboratorio-detalle';
import { LaboratorioFormulario } from './components/laboratorio-formulario/laboratorio-formulario';
import { ReservasLista } from './components/reservas-lista/reservas-lista';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: Dashboard
  },
  {
    path: 'laboratorios',
    component: LaboratorioLista
  },
  {
    path: 'laboratorios/nuevo',
    component: LaboratorioFormulario
  },
  {
    path: 'laboratorios/:id',
    component: LaboratorioDetalle
  },
  {
    path: 'laboratorios/:id/editar',
    component: LaboratorioFormulario
  },
  {
    path: 'reservas',
    component: ReservasLista
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
