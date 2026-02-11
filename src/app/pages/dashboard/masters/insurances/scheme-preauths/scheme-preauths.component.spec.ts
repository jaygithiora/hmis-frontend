import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchemePreauthsComponent } from './scheme-preauths.component';

describe('SchemePreauthsComponent', () => {
  let component: SchemePreauthsComponent;
  let fixture: ComponentFixture<SchemePreauthsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SchemePreauthsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SchemePreauthsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
