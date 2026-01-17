import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewOfSystemsFormComponent } from './review-of-systems-form.component';

describe('ReviewOfSystemsFormComponent', () => {
  let component: ReviewOfSystemsFormComponent;
  let fixture: ComponentFixture<ReviewOfSystemsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReviewOfSystemsFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReviewOfSystemsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
