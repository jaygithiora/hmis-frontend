import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageItemsComponent } from './triage-items.component';

describe('TriageItemsComponent', () => {
  let component: TriageItemsComponent;
  let fixture: ComponentFixture<TriageItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriageItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriageItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
