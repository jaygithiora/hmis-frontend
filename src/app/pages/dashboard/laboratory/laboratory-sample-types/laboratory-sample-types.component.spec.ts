import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorySampleTypesComponent } from './laboratory-sample-types.component';

describe('LaboratorySampleTypesComponent', () => {
  let component: LaboratorySampleTypesComponent;
  let fixture: ComponentFixture<LaboratorySampleTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratorySampleTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratorySampleTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
