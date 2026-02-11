import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeCopaymentsComponent } from './scheme-copayments.component';

describe('SchemeCopaymentsComponent', () => {
  let component: SchemeCopaymentsComponent;
  let fixture: ComponentFixture<SchemeCopaymentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchemeCopaymentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemeCopaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
