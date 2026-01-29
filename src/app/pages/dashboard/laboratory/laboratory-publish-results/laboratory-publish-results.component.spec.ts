import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryPublishResultsComponent } from './laboratory-publish-results.component';

describe('LaboratoryPublishResultsComponent', () => {
  let component: LaboratoryPublishResultsComponent;
  let fixture: ComponentFixture<LaboratoryPublishResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryPublishResultsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryPublishResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
