import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryEquipmentsComponent } from './laboratory-equipments.component';

describe('LaboratoryEquipmentsComponent', () => {
  let component: LaboratoryEquipmentsComponent;
  let fixture: ComponentFixture<LaboratoryEquipmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryEquipmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryEquipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
