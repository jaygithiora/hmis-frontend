import { TestBed } from '@angular/core/testing';

import { LaboratoryWorkListService } from './laboratory-work-list.service';

describe('LaboratoryWorkListService', () => {
  let service: LaboratoryWorkListService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryWorkListService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
