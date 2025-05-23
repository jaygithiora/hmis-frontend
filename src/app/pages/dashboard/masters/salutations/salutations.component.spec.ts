import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalutationsComponent } from './salutations.component';

describe('SalutationsComponent', () => {
  let component: SalutationsComponent;
  let fixture: ComponentFixture<SalutationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SalutationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SalutationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
