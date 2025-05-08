import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoseMeasuresComponent } from './dose-measures.component';

describe('DoseMeasuresComponent', () => {
  let component: DoseMeasuresComponent;
  let fixture: ComponentFixture<DoseMeasuresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DoseMeasuresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DoseMeasuresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
