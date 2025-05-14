import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageCategoriesComponent } from './triage-categories.component';

describe('TriageCategoriesComponent', () => {
  let component: TriageCategoriesComponent;
  let fixture: ComponentFixture<TriageCategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriageCategoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriageCategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
