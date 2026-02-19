import { TestBed } from '@angular/core/testing';

import { IdentificationDocumentTypesService } from './identification-document-types.service';

describe('IdentificationDocumentTypesService', () => {
  let service: IdentificationDocumentTypesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IdentificationDocumentTypesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
