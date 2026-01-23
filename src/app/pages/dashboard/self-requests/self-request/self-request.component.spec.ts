import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelfRequestComponent } from './self-request.component';

describe('SelfRequestComponent', () => {
  let component: SelfRequestComponent;
  let fixture: ComponentFixture<SelfRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SelfRequestComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SelfRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
