import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryInterpretationsComponent } from './laboratory-interpretations.component';

describe('LaboratoryInterpretationsComponent', () => {
  let component: LaboratoryInterpretationsComponent;
  let fixture: ComponentFixture<LaboratoryInterpretationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryInterpretationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryInterpretationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
