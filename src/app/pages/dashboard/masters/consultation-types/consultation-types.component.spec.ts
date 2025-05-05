import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultationTypesComponent } from './consultation-types.component';

describe('ConsultationTypesComponent', () => {
  let component: ConsultationTypesComponent;
  let fixture: ComponentFixture<ConsultationTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConsultationTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConsultationTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
