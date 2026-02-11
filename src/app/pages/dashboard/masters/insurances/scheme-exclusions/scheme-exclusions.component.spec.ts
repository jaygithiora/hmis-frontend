import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeExclusionsComponent } from './scheme-exclusions.component';

describe('SchemeExclusionsComponent', () => {
  let component: SchemeExclusionsComponent;
  let fixture: ComponentFixture<SchemeExclusionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchemeExclusionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemeExclusionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
