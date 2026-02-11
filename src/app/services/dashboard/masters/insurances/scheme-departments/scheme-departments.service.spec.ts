import { TestBed } from '@angular/core/testing';

import { SchemeDepartmentsService } from './scheme-departments.service';

describe('SchemeDepartmentsService', () => {
  let service: SchemeDepartmentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SchemeDepartmentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
