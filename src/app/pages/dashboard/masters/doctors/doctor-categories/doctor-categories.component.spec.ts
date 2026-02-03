import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorCategoriesComponent } from './doctor-categories.component';

describe('DoctorCategoriesComponent', () => {
  let component: DoctorCategoriesComponent;
  let fixture: ComponentFixture<DoctorCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoctorCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoctorCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
