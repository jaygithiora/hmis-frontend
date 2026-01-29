import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillReprintsComponent } from './bill-reprints.component';

describe('BillReprintsComponent', () => {
  let component: BillReprintsComponent;
  let fixture: ComponentFixture<BillReprintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BillReprintsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BillReprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
