import { TestBed } from '@angular/core/testing';

import { LaboratoryTestReferencesService } from './laboratory-test-references.service';

describe('LaboratoryTestReferencesService', () => {
  let service: LaboratoryTestReferencesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryTestReferencesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
