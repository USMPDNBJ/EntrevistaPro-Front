import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VerSesionesComponent } from './ver-sesiones.component';

describe('VerSesionesComponent', () => {
  let component: VerSesionesComponent;
  let fixture: ComponentFixture<VerSesionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VerSesionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VerSesionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
