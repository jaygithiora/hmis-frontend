import { TestBed } from '@angular/core/testing';

import { DoseMeasuresService } from './dose-measures.service';

describe('DoseMeasuresService', () => {
  let service: DoseMeasuresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DoseMeasuresService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
