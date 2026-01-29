import { TestBed } from '@angular/core/testing';

import { LaboratoryLinkingService } from './laboratory-linking.service';

describe('LaboratoryLinkingService', () => {
  let service: LaboratoryLinkingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryLinkingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
