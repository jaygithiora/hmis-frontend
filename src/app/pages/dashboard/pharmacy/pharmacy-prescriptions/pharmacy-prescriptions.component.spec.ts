import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyPrescriptionsComponent } from './pharmacy-prescriptions.component';

describe('PharmacyPrescriptionsComponent', () => {
  let component: PharmacyPrescriptionsComponent;
  let fixture: ComponentFixture<PharmacyPrescriptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyPrescriptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PharmacyPrescriptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
