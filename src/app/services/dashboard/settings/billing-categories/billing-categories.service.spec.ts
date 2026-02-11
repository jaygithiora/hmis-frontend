import { TestBed } from '@angular/core/testing';

import { BillingCategoriesService } from './billing-categories.service';

describe('BillingCategoriesService', () => {
  let service: BillingCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BillingCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
