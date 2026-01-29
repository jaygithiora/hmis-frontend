import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OpDiscountApprovalsComponent } from './op-discount-approvals.component';

describe('OpDiscountApprovalsComponent', () => {
  let component: OpDiscountApprovalsComponent;
  let fixture: ComponentFixture<OpDiscountApprovalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OpDiscountApprovalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(OpDiscountApprovalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
