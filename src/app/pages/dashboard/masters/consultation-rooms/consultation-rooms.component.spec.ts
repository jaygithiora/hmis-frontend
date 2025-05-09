import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationRoomsComponent } from './consultation-rooms.component';

describe('ConsultationRoomsComponent', () => {
  let component: ConsultationRoomsComponent;
  let fixture: ComponentFixture<ConsultationRoomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultationRoomsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
