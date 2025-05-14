import { TestBed } from '@angular/core/testing';

import { TriageCategoriesService } from './triage-categories.service';

describe('TriageCategoriesService', () => {
  let service: TriageCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriageCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
