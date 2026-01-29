import { TestBed } from '@angular/core/testing';

import { LaboratoryEquipmentService } from './laboratory-equipment.service';

describe('LaboratoryEquipmentService', () => {
  let service: LaboratoryEquipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LaboratoryEquipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
