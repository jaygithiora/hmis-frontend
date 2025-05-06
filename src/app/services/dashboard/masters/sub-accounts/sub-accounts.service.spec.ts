import { TestBed } from '@angular/core/testing';

import { SubAccountsService } from './sub-accounts.service';

describe('SubAccountsService', () => {
  let service: SubAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
