import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllergiesFormComponent } from './allergies-form.component';

describe('AllergiesFormComponent', () => {
  let component: AllergiesFormComponent;
  let fixture: ComponentFixture<AllergiesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllergiesFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AllergiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
