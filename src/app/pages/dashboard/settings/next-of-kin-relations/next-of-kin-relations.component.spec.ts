import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NextOfKinRelationsComponent } from './next-of-kin-relations.component';

describe('NextOfKinRelationsComponent', () => {
  let component: NextOfKinRelationsComponent;
  let fixture: ComponentFixture<NextOfKinRelationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NextOfKinRelationsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(NextOfKinRelationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
