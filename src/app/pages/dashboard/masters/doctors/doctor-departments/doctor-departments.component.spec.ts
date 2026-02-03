import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDepartmentsComponent } from './doctor-departments.component';

describe('DoctorDepartmentsComponent', () => {
  let component: DoctorDepartmentsComponent;
  let fixture: ComponentFixture<DoctorDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorDepartmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
