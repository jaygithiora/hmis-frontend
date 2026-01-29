import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorySampleCollectionComponent } from './laboratory-sample-collection.component';

describe('LaboratorySampleCollectionComponent', () => {
  let component: LaboratorySampleCollectionComponent;
  let fixture: ComponentFixture<LaboratorySampleCollectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratorySampleCollectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratorySampleCollectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
