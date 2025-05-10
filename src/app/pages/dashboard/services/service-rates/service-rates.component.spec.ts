import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceRatesComponent } from './service-rates.component';

describe('ServiceRatesComponent', () => {
  let component: ServiceRatesComponent;
  let fixture: ComponentFixture<ServiceRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ServiceRatesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ServiceRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
