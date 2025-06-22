import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalHistoriesComponent } from './medical-histories.component';

describe('MedicalHistoriesComponent', () => {
  let component: MedicalHistoriesComponent;
  let fixture: ComponentFixture<MedicalHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MedicalHistoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MedicalHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
