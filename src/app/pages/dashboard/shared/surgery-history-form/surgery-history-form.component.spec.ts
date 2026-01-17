import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgeryHistoryFormComponent } from './surgery-history-form.component';

describe('SurgeryHistoryFormComponent', () => {
  let component: SurgeryHistoryFormComponent;
  let fixture: ComponentFixture<SurgeryHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurgeryHistoryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurgeryHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
