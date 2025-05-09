import { TestBed } from '@angular/core/testing';

import { RadiologyCategoriesService } from './radiology-categories.service';

describe('RadiologyCategoriesService', () => {
  let service: RadiologyCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadiologyCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
