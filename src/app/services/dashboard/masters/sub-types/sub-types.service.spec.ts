import { TestBed } from '@angular/core/testing';

import { SubTypesService } from './sub-types.service';

describe('SubTypesService', () => {
  let service: SubTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
