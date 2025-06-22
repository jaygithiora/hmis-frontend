import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurgerySettingsComponent } from './surgery-settings.component';

describe('SurgerySettingsComponent', () => {
  let component: SurgerySettingsComponent;
  let fixture: ComponentFixture<SurgerySettingsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurgerySettingsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SurgerySettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
