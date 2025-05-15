import { TestBed } from '@angular/core/testing';

import { TriageItemsService } from './triage-items.service';

describe('TriageItemsService', () => {
  let service: TriageItemsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TriageItemsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
