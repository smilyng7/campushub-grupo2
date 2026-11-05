import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard {

  totalLaboratorios = 8;
  laboratoriosDisponibles = 6;
  laboratoriosMantenimiento = 2;

  totalReservas = 20;
  reservasPendientes = 7;
  reservasAprobadas = 9;
  reservasRechazadas = 4;

}
