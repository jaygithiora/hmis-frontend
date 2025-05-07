import { TestBed } from '@angular/core/testing';

import { PackSizesService } from './pack-sizes.service';

describe('PackSizesService', () => {
  let service: PackSizesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PackSizesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
