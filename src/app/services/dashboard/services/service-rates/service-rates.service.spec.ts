import { TestBed } from '@angular/core/testing';

import { ServiceRatesService } from './service-rates.service';

describe('ServiceRatesService', () => {
  let service: ServiceRatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceRatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
