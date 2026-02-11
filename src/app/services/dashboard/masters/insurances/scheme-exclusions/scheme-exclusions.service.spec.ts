import { TestBed } from '@angular/core/testing';

import { SchemeExclusionsService } from './scheme-exclusions.service';

describe('SchemeExclusionsService', () => {
  let service: SchemeExclusionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemeExclusionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
