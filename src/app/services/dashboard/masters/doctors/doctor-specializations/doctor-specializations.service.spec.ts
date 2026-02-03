import { TestBed } from '@angular/core/testing';

import { DoctorSpecializationsService } from './doctor-specializations.service';

describe('DoctorSpecializationsService', () => {
  let service: DoctorSpecializationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorSpecializationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
