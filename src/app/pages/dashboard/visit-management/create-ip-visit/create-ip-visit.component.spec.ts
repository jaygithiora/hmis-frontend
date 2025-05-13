import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateIpVisitComponent } from './create-ip-visit.component';

describe('CreateIpVisitComponent', () => {
  let component: CreateIpVisitComponent;
  let fixture: ComponentFixture<CreateIpVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateIpVisitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateIpVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
