import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentModesComponent } from './payment-modes.component';

describe('PaymentModesComponent', () => {
  let component: PaymentModesComponent;
  let fixture: ComponentFixture<PaymentModesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaymentModesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PaymentModesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
