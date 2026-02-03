import { TestBed } from '@angular/core/testing';

import { InsurancesService } from './insurances.service';

describe('InsurancesService', () => {
  let service: InsurancesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InsurancesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
