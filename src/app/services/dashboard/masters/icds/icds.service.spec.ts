import { TestBed } from '@angular/core/testing';

import { IcdsService } from './icds.service';

describe('IcdsService', () => {
  let service: IcdsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IcdsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
