import { TestBed } from '@angular/core/testing';

import { NextOfKinRelationsService } from './next-of-kin-relations.service';

describe('NextOfKinRelationsService', () => {
  let service: NextOfKinRelationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NextOfKinRelationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
