import { TestBed } from '@angular/core/testing';

import { PurchaseTypesService } from './purchase-types.service';

describe('PurchaseTypesService', () => {
  let service: PurchaseTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PurchaseTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
