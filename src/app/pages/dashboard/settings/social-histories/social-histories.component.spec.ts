import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialHistoriesComponent } from './social-histories.component';

describe('SocialHistoriesComponent', () => {
  let component: SocialHistoriesComponent;
  let fixture: ComponentFixture<SocialHistoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SocialHistoriesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SocialHistoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
