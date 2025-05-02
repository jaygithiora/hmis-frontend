import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HospitalDataComponent } from './hospital-data.component';

describe('HospitalDataComponent', () => {
  let component: HospitalDataComponent;
  let fixture: ComponentFixture<HospitalDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HospitalDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HospitalDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
