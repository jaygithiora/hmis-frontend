import { TestBed } from '@angular/core/testing';

import { ProductStocksService } from './product-stocks.service';

describe('ProductStocksService', () => {
  let service: ProductStocksService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductStocksService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
