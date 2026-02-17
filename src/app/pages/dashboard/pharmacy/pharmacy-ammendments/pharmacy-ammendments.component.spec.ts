import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyAmmendmentsComponent } from './pharmacy-ammendments.component';

describe('PharmacyAmmendmentsComponent', () => {
  let component: PharmacyAmmendmentsComponent;
  let fixture: ComponentFixture<PharmacyAmmendmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyAmmendmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PharmacyAmmendmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
