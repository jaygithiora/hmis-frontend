import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryCategoriesComponent } from './laboratory-categories.component';

describe('LaboratoryCategoriesComponent', () => {
  let component: LaboratoryCategoriesComponent;
  let fixture: ComponentFixture<LaboratoryCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
