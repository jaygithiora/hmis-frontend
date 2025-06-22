import { TestBed } from '@angular/core/testing';

import { SocialHistoriesService } from './social-histories.service';

describe('SocialHistoriesService', () => {
  let service: SocialHistoriesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialHistoriesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
