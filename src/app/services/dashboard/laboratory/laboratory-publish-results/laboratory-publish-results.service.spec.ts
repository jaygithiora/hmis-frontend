import { TestBed } from '@angular/core/testing';

import { LaboratoryPublishResultsService } from './laboratory-publish-results.service';

describe('LaboratoryPublishResultsService', () => {
  let service: LaboratoryPublishResultsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryPublishResultsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
