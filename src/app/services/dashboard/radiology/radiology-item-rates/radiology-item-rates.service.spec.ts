import { TestBed } from '@angular/core/testing';

import { RadiologyItemRatesService } from './radiology-item-rates.service';

describe('RadiologyItemRatesService', () => {
  let service: RadiologyItemRatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadiologyItemRatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
