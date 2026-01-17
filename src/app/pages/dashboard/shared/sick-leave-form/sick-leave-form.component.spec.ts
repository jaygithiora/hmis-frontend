import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SickLeaveFormComponent } from './sick-leave-form.component';

describe('SickLeaveFormComponent', () => {
  let component: SickLeaveFormComponent;
  let fixture: ComponentFixture<SickLeaveFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SickLeaveFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SickLeaveFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
