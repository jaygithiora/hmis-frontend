import { TestBed } from '@angular/core/testing';

import { DoctorCategoriesService } from './doctor-categories.service';

describe('DoctorCategoriesService', () => {
  let service: DoctorCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoctorCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
