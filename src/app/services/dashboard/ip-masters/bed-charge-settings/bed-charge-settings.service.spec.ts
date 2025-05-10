import { TestBed } from '@angular/core/testing';

import { BedChargeSettingsService } from './bed-charge-settings.service';

describe('BedChargeSettingsService', () => {
  let service: BedChargeSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BedChargeSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
