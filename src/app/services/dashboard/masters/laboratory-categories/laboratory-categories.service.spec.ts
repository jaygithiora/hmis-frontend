import { TestBed } from '@angular/core/testing';

import { LaboratoryCategoriesService } from './laboratory-categories.service';

describe('LaboratoryCategoriesService', () => {
  let service: LaboratoryCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
