import { TestBed } from '@angular/core/testing';

import { DrugFrequenciesService } from './drug-frequencies.service';

describe('DrugFrequenciesService', () => {
  let service: DrugFrequenciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrugFrequenciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
