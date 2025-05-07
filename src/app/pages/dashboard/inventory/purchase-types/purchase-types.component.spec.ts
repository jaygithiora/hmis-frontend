import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseTypesComponent } from './purchase-types.component';

describe('PurchaseTypesComponent', () => {
  let component: PurchaseTypesComponent;
  let fixture: ComponentFixture<PurchaseTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PurchaseTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PurchaseTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
