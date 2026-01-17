import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DrugFrequenciesComponent } from './drug-frequencies.component';

describe('DrugFrequenciesComponent', () => {
  let component: DrugFrequenciesComponent;
  let fixture: ComponentFixture<DrugFrequenciesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DrugFrequenciesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DrugFrequenciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
