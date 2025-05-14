import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendarReunionComponent } from './agendar-reunion.component';

describe('AgendarReunionComponent', () => {
  let component: AgendarReunionComponent;
  let fixture: ComponentFixture<AgendarReunionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgendarReunionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendarReunionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
