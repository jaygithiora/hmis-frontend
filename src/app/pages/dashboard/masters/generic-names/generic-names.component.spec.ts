import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericNamesComponent } from './generic-names.component';

describe('GenericNamesComponent', () => {
  let component: GenericNamesComponent;
  let fixture: ComponentFixture<GenericNamesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GenericNamesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GenericNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
