import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryWorkListComponent } from './laboratory-work-list.component';

describe('LaboratoryWorkListComponent', () => {
  let component: LaboratoryWorkListComponent;
  let fixture: ComponentFixture<LaboratoryWorkListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryWorkListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryWorkListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
