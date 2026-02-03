import { TestBed } from '@angular/core/testing';

import { FeeTypesService } from './fee-types.service';

describe('FeeTypesService', () => {
  let service: FeeTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeeTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
