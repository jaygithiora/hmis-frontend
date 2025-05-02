import { TestBed } from '@angular/core/testing';

import { MainTypesService } from './main-types.service';

describe('MainTypesService', () => {
  let service: MainTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
