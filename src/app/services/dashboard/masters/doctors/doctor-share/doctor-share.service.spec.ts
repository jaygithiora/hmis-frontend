import { TestBed } from '@angular/core/testing';

import { DoctorShareService } from './doctor-share.service';

describe('DoctorShareService', () => {
  let service: DoctorShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
