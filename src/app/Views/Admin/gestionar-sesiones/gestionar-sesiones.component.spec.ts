import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSesionesComponent } from './gestionar-sesiones.component';

describe('GestionarSesionesComponent', () => {
  let component: GestionarSesionesComponent;
  let fixture: ComponentFixture<GestionarSesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionarSesionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionarSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
