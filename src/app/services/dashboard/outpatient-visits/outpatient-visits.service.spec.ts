import { TestBed } from '@angular/core/testing';

import { OutpatientVisitsService } from './outpatient-visits.service';

describe('OutpatientVisitsService', () => {
  let service: OutpatientVisitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OutpatientVisitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
