import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryTestsComponent } from './laboratory-tests.component';

describe('LaboratoryTestsComponent', () => {
  let component: LaboratoryTestsComponent;
  let fixture: ComponentFixture<LaboratoryTestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryTestsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryTestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
