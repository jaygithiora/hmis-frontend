import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryResultEntryComponent } from './laboratory-result-entry.component';

describe('LaboratoryResultEntryComponent', () => {
  let component: LaboratoryResultEntryComponent;
  let fixture: ComponentFixture<LaboratoryResultEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryResultEntryComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryResultEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
