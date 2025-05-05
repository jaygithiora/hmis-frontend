import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainAccountsComponent } from './main-accounts.component';

describe('MainAccountsComponent', () => {
  let component: MainAccountsComponent;
  let fixture: ComponentFixture<MainAccountsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainAccountsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MainAccountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
