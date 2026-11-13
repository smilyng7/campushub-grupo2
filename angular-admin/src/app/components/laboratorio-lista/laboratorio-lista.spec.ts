import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LaboratorioLista } from './laboratorio-lista';

describe('LaboratorioLista', () => {
  let component: LaboratorioLista;
  let fixture: ComponentFixture<LaboratorioLista>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LaboratorioLista],
    }).compileComponents();

    fixture = TestBed.createComponent(LaboratorioLista);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
