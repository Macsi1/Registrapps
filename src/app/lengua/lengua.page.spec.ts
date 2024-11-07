import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LenguaPage } from './lengua.page';

describe('LenguaPage', () => {
  let component: LenguaPage;
  let fixture: ComponentFixture<LenguaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LenguaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
