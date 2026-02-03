import { TestBed } from '@angular/core/testing';

import { LaboratoryResultsMasterDataService } from './laboratory-results-master-data.service';

describe('LaboratoryResultsMasterDataService', () => {
  let service: LaboratoryResultsMasterDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryResultsMasterDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
