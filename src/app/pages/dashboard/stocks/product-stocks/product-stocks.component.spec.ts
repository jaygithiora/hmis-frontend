import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductStocksComponent } from './product-stocks.component';

describe('ProductStocksComponent', () => {
  let component: ProductStocksComponent;
  let fixture: ComponentFixture<ProductStocksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProductStocksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ProductStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
