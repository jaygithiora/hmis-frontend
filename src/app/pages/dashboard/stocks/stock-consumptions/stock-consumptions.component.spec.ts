import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockConsumptionsComponent } from './stock-consumptions.component';

describe('StockConsumptionsComponent', () => {
  let component: StockConsumptionsComponent;
  let fixture: ComponentFixture<StockConsumptionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StockConsumptionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockConsumptionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
