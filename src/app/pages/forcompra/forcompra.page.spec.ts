import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ForcompraPage } from './forcompra.page';

describe('ForcompraPage', () => {
  let component: ForcompraPage;
  let fixture: ComponentFixture<ForcompraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ForcompraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
