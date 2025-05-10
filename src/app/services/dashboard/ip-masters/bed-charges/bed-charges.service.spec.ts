import { TestBed } from '@angular/core/testing';

import { BedChargesService } from './bed-charges.service';

describe('BedChargesService', () => {
  let service: BedChargesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedChargesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
