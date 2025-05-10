import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedChargeSettingsComponent } from './bed-charge-settings.component';

describe('BedChargeSettingsComponent', () => {
  let component: BedChargeSettingsComponent;
  let fixture: ComponentFixture<BedChargeSettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BedChargeSettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BedChargeSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
