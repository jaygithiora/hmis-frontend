import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpDiscountApprovalComponent } from './op-discount-approval.component';

describe('OpDiscountApprovalComponent', () => {
  let component: OpDiscountApprovalComponent;
  let fixture: ComponentFixture<OpDiscountApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpDiscountApprovalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpDiscountApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
