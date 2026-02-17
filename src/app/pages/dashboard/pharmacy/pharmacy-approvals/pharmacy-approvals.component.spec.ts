import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyApprovalsComponent } from './pharmacy-approvals.component';

describe('PharmacyApprovalsComponent', () => {
  let component: PharmacyApprovalsComponent;
  let fixture: ComponentFixture<PharmacyApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PharmacyApprovalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PharmacyApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
