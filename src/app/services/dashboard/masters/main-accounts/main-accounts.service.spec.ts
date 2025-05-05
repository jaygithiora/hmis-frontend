import { TestBed } from '@angular/core/testing';

import { MainAccountsService } from './main-accounts.service';

describe('MainAccountsService', () => {
  let service: MainAccountsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainAccountsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
