import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratorySampleCollectionsComponent } from './laboratory-sample-collections.component';

describe('LaboratorySampleCollectionsComponent', () => {
  let component: LaboratorySampleCollectionsComponent;
  let fixture: ComponentFixture<LaboratorySampleCollectionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratorySampleCollectionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratorySampleCollectionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
