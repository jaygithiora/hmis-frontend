import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyCategoriesComponent } from './radiology-categories.component';

describe('RadiologyCategoriesComponent', () => {
  let component: RadiologyCategoriesComponent;
  let fixture: ComponentFixture<RadiologyCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiologyCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiologyCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
