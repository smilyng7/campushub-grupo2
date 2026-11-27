import { provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaboratorioFormulario } from './laboratorio-formulario';

describe('LaboratorioFormulario', () => {
  let component: LaboratorioFormulario;
  let fixture: ComponentFixture<LaboratorioFormulario>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideRouter([])],
      imports: [LaboratorioFormulario],
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratorioFormulario);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
