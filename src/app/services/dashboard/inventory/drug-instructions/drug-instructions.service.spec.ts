import { TestBed } from '@angular/core/testing';

import { DrugInstructionsService } from './drug-instructions.service';

describe('DrugInstructionsService', () => {
  let service: DrugInstructionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DrugInstructionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
