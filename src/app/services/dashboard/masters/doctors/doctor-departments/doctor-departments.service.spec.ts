import { TestBed } from '@angular/core/testing';

import { DoctorDepartmentsService } from './doctor-departments.service';

describe('DoctorDepartmentsService', () => {
  let service: DoctorDepartmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorDepartmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
