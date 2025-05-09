import { TestBed } from '@angular/core/testing';

import { RadiologyItemsService } from './radiology-items.service';

describe('RadiologyItemsService', () => {
  let service: RadiologyItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RadiologyItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
