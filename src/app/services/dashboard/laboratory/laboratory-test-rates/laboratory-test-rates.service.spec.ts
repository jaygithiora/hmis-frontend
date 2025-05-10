import { TestBed } from '@angular/core/testing';

import { LaboratoryTestRatesService } from './laboratory-test-rates.service';

describe('LaboratoryTestRatesService', () => {
  let service: LaboratoryTestRatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryTestRatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
