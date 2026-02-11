import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryTestRatesComponent } from './laboratory-test-rates.component';

describe('LaboratoryTestRatesComponent', () => {
  let component: LaboratoryTestRatesComponent;
  let fixture: ComponentFixture<LaboratoryTestRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryTestRatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryTestRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
