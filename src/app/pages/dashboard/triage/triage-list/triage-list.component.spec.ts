import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TriageListComponent } from './triage-list.component';

describe('TriageListComponent', () => {
  let component: TriageListComponent;
  let fixture: ComponentFixture<TriageListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TriageListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(TriageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
