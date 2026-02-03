import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSpecializationsComponent } from './doctor-specializations.component';

describe('DoctorSpecializationsComponent', () => {
  let component: DoctorSpecializationsComponent;
  let fixture: ComponentFixture<DoctorSpecializationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorSpecializationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorSpecializationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
