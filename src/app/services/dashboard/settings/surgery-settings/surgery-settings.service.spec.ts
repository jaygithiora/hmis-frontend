import { TestBed } from '@angular/core/testing';

import { SurgerySettingsService } from './surgery-settings.service';

describe('SurgerySettingsService', () => {
  let service: SurgerySettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SurgerySettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
