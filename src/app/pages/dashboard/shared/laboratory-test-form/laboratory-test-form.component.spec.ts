import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryTestFormComponent } from './laboratory-test-form.component';

describe('LaboratoryTestFormComponent', () => {
  let component: LaboratoryTestFormComponent;
  let fixture: ComponentFixture<LaboratoryTestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryTestFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryTestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
