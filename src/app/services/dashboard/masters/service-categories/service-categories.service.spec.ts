import { TestBed } from '@angular/core/testing';

import { ServiceCategoriesService } from './service-categories.service';

describe('ServiceCategoriesService', () => {
  let service: ServiceCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServiceCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
