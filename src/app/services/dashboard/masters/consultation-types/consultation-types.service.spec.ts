import { TestBed } from '@angular/core/testing';

import { ConsultationTypesService } from './consultation-types.service';

describe('ConsultationTypesService', () => {
  let service: ConsultationTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultationTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
