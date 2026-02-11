import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemeDepartmentsComponent } from './scheme-departments.component';

describe('SchemeDepartmentsComponent', () => {
  let component: SchemeDepartmentsComponent;
  let fixture: ComponentFixture<SchemeDepartmentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchemeDepartmentsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemeDepartmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
