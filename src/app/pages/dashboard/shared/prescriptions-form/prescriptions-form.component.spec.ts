import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionsFormComponent } from './prescriptions-form.component';

describe('PrescriptionsFormComponent', () => {
  let component: PrescriptionsFormComponent;
  let fixture: ComponentFixture<PrescriptionsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PrescriptionsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrescriptionsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
