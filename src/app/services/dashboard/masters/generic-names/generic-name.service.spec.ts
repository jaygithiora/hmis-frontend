import { TestBed } from '@angular/core/testing';

import { GenericNameService } from './generic-name.service';

describe('GenericNameService', () => {
  let service: GenericNameService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GenericNameService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
