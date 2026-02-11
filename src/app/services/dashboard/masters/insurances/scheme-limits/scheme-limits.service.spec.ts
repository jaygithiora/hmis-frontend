import { TestBed } from '@angular/core/testing';

import { SchemeLimitsService } from './scheme-limits.service';

describe('SchemeLimitsService', () => {
  let service: SchemeLimitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemeLimitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
