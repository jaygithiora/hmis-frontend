import { TestBed } from '@angular/core/testing';

import { LaboratorySampleTypeService } from './laboratory-sample-type.service';

describe('LaboratorySampleTypeService', () => {
  let service: LaboratorySampleTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratorySampleTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
