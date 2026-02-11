import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LaboratoryLinkingComponent } from './laboratory-linking.component';

describe('LaboratoryLinkingComponent', () => {
  let component: LaboratoryLinkingComponent;
  let fixture: ComponentFixture<LaboratoryLinkingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LaboratoryLinkingComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LaboratoryLinkingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
