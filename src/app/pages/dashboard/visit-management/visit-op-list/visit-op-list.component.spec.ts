import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitOpListComponent } from './visit-op-list.component';

describe('VisitOpListComponent', () => {
  let component: VisitOpListComponent;
  let fixture: ComponentFixture<VisitOpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitOpListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitOpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
