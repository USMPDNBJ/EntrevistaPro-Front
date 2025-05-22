import { ComponentFixture, TestBed } from '@angular/core/testing';

import { pasarelaComponent } from './pasarela.component';

describe('PasarelaComponent', () => {
  let component: pasarelaComponent;
  let fixture: ComponentFixture<pasarelaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [pasarelaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(pasarelaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
