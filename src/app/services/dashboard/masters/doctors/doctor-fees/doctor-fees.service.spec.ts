import { TestBed } from '@angular/core/testing';

import { DoctorFeesService } from './doctor-fees.service';

describe('DoctorFeesService', () => {
  let service: DoctorFeesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorFeesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
