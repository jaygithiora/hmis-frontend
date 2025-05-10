import { TestBed } from '@angular/core/testing';

import { LaboratoryTestsService } from './laboratory-tests.service';

describe('LaboratoryTestsService', () => {
  let service: LaboratoryTestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryTestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
