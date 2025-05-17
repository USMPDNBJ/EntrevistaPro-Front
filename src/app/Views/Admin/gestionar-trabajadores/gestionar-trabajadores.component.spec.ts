import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarTrabajadoresComponent } from './gestionar-trabajadores.component';

describe('GestionarTrabajadoresComponent', () => {
  let component: GestionarTrabajadoresComponent;
  let fixture: ComponentFixture<GestionarTrabajadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarTrabajadoresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarTrabajadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
