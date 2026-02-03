import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryResultsMasterDataComponent } from './laboratory-results-master-data.component';

describe('LaboratoryResultsMasterDataComponent', () => {
  let component: LaboratoryResultsMasterDataComponent;
  let fixture: ComponentFixture<LaboratoryResultsMasterDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryResultsMasterDataComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryResultsMasterDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
