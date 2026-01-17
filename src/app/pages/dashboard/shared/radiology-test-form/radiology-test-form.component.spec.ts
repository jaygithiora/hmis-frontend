import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyTestFormComponent } from './radiology-test-form.component';

describe('RadiologyTestFormComponent', () => {
  let component: RadiologyTestFormComponent;
  let fixture: ComponentFixture<RadiologyTestFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiologyTestFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiologyTestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
