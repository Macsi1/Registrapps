import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AsignaturaDetallePage } from './asignatura-detalle.page';

describe('AsignaturaDetallePage', () => {
  let component: AsignaturaDetallePage;
  let fixture: ComponentFixture<AsignaturaDetallePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AsignaturaDetallePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
