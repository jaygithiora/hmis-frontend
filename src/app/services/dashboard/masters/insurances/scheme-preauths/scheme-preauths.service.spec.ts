import { TestBed } from '@angular/core/testing';

import { SchemePreauthsService } from './scheme-preauths.service';

describe('SchemePreauthsService', () => {
  let service: SchemePreauthsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemePreauthsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
