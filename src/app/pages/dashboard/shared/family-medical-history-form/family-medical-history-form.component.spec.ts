import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FamilyMedicalHistoryFormComponent } from './family-medical-history-form.component';

describe('FamilyMedicalHistoryFormComponent', () => {
  let component: FamilyMedicalHistoryFormComponent;
  let fixture: ComponentFixture<FamilyMedicalHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FamilyMedicalHistoryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FamilyMedicalHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
