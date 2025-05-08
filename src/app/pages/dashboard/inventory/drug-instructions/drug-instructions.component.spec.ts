import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugInstructionsComponent } from './drug-instructions.component';

describe('DrugInstructionsComponent', () => {
  let component: DrugInstructionsComponent;
  let fixture: ComponentFixture<DrugInstructionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrugInstructionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrugInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
