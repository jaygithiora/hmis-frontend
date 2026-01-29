import { TestBed } from '@angular/core/testing';

import { LaboratoryInterpretationsService } from './laboratory-interpretations.service';

describe('LaboratoryInterpretationsService', () => {
  let service: LaboratoryInterpretationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryInterpretationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
