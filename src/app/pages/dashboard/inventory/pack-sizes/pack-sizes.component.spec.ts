import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackSizesComponent } from './pack-sizes.component';

describe('PackSizesComponent', () => {
  let component: PackSizesComponent;
  let fixture: ComponentFixture<PackSizesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackSizesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackSizesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
