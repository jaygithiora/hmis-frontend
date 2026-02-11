import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeLimitsComponent } from './scheme-limits.component';

describe('SchemeLimitsComponent', () => {
  let component: SchemeLimitsComponent;
  let fixture: ComponentFixture<SchemeLimitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchemeLimitsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemeLimitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
