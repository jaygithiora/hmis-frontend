import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IcdsComponent } from './icds.component';

describe('IcdsComponent', () => {
  let component: IcdsComponent;
  let fixture: ComponentFixture<IcdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IcdsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IcdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
