import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOpVisitComponent } from './create-op-visit.component';

describe('CreateOpVisitComponent', () => {
  let component: CreateOpVisitComponent;
  let fixture: ComponentFixture<CreateOpVisitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateOpVisitComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreateOpVisitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
