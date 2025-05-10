import { TestBed } from '@angular/core/testing';

import { ProductRatesService } from './product-rates.service';

describe('ProductRatesService', () => {
  let service: ProductRatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductRatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
