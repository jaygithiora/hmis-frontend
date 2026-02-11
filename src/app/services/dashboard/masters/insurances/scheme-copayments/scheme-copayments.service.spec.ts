import { TestBed } from '@angular/core/testing';

import { SchemeCopaymentsService } from './scheme-copayments.service';

describe('SchemeCopaymentsService', () => {
  let service: SchemeCopaymentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemeCopaymentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
