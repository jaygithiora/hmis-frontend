import { TestBed } from '@angular/core/testing';

import { LaboratorySampleCollectionsService } from './laboratory-sample-collections.service';

describe('LaboratorySampleCollectionsService', () => {
  let service: LaboratorySampleCollectionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratorySampleCollectionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
