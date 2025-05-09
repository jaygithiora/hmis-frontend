import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RadiologyItemsComponent } from './radiology-items.component';

describe('RadiologyItemsComponent', () => {
  let component: RadiologyItemsComponent;
  let fixture: ComponentFixture<RadiologyItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RadiologyItemsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RadiologyItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
