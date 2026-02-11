import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryTestReferencesComponent } from './laboratory-test-references.component';

describe('LaboratoryTestReferencesComponent', () => {
  let component: LaboratoryTestReferencesComponent;
  let fixture: ComponentFixture<LaboratoryTestReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryTestReferencesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryTestReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
