import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyItemRatesComponent } from './radiology-item-rates.component';

describe('RadiologyItemRatesComponent', () => {
  let component: RadiologyItemRatesComponent;
  let fixture: ComponentFixture<RadiologyItemRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiologyItemRatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiologyItemRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
