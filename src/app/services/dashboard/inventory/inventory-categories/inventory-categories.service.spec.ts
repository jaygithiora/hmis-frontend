import { TestBed } from '@angular/core/testing';

import { InventoryCategoriesService } from './inventory-categories.service';

describe('InventoryCategoriesService', () => {
  let service: InventoryCategoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InventoryCategoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
