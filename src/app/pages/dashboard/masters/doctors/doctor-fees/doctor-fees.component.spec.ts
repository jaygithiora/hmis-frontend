import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorFeesComponent } from './doctor-fees.component';

describe('DoctorFeesComponent', () => {
  let component: DoctorFeesComponent;
  let fixture: ComponentFixture<DoctorFeesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorFeesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorFeesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
