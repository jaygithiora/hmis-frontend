import { TestBed } from '@angular/core/testing';

import { StrengthUnitsService } from './strength-units.service';

describe('StrengthUnitsService', () => {
  let service: StrengthUnitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StrengthUnitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
