import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InglesPage } from './ingles.page';

describe('InglesPage', () => {
  let component: InglesPage;
  let fixture: ComponentFixture<InglesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InglesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
