import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BloodGroupsComponent } from './blood-groups.component';

describe('BloodGroupsComponent', () => {
  let component: BloodGroupsComponent;
  let fixture: ComponentFixture<BloodGroupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BloodGroupsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BloodGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
