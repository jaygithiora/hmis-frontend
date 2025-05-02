import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainTypesComponent } from './main-types.component';

describe('MainTypesComponent', () => {
  let component: MainTypesComponent;
  let fixture: ComponentFixture<MainTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
