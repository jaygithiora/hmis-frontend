import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BedChargesComponent } from './bed-charges.component';

describe('BedChargesComponent', () => {
  let component: BedChargesComponent;
  let fixture: ComponentFixture<BedChargesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BedChargesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BedChargesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
