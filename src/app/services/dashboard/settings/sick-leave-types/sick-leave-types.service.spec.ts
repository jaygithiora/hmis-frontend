import { TestBed } from '@angular/core/testing';

import { SickLeaveTypesService } from './sick-leave-types.service';

describe('SickLeaveTypesService', () => {
  let service: SickLeaveTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SickLeaveTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
