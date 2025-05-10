import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductRatesComponent } from './product-rates.component';

describe('ProductRatesComponent', () => {
  let component: ProductRatesComponent;
  let fixture: ComponentFixture<ProductRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductRatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
