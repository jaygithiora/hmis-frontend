import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StrengthUnitsComponent } from './strength-units.component';

describe('StrengthUnitsComponent', () => {
  let component: StrengthUnitsComponent;
  let fixture: ComponentFixture<StrengthUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StrengthUnitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StrengthUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
