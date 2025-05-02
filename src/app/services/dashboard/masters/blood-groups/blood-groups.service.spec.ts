import { TestBed } from '@angular/core/testing';

import { BloodGroupsService } from './blood-groups.service';

describe('BloodGroupsService', () => {
  let service: BloodGroupsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BloodGroupsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
