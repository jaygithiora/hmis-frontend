import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillingCategoriesComponent } from './billing-categories.component';

describe('BillingCategoriesComponent', () => {
  let component: BillingCategoriesComponent;
  let fixture: ComponentFixture<BillingCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillingCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillingCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
