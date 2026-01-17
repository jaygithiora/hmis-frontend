import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialHistoryFormComponent } from './social-history-form.component';

describe('SocialHistoryFormComponent', () => {
  let component: SocialHistoryFormComponent;
  let fixture: ComponentFixture<SocialHistoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialHistoryFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialHistoryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
