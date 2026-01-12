import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SickLeaveTypesComponent } from './sick-leave-types.component';

describe('SickLeaveTypesComponent', () => {
  let component: SickLeaveTypesComponent;
  let fixture: ComponentFixture<SickLeaveTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SickLeaveTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SickLeaveTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
