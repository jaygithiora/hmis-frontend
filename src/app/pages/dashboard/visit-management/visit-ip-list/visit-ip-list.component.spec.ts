import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisitIpListComponent } from './visit-ip-list.component';

describe('VisitIpListComponent', () => {
  let component: VisitIpListComponent;
  let fixture: ComponentFixture<VisitIpListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [VisitIpListComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(VisitIpListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
