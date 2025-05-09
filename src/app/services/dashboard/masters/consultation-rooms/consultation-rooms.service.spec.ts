import { TestBed } from '@angular/core/testing';

import { ConsultationRoomsService } from './consultation-rooms.service';

describe('ConsultationRoomsService', () => {
  let service: ConsultationRoomsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConsultationRoomsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
