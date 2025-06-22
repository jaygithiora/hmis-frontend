import { TestBed } from '@angular/core/testing';

import { MedicalHistoriesService } from './medical-histories.service';

describe('MedicalHistoriesService', () => {
  let service: MedicalHistoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MedicalHistoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
