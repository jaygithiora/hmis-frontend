import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationNotesFormComponent } from './consultation-notes-form.component';

describe('ConsultationNotesFormComponent', () => {
  let component: ConsultationNotesFormComponent;
  let fixture: ComponentFixture<ConsultationNotesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultationNotesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationNotesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
