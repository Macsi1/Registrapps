import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CienciaPage } from './ciencia.page';

describe('CienciaPage', () => {
  let component: CienciaPage;
  let fixture: ComponentFixture<CienciaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CienciaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
