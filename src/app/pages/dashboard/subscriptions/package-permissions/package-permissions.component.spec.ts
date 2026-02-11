import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackagePermissionsComponent } from './package-permissions.component';

describe('PackagePermissionsComponent', () => {
  let component: PackagePermissionsComponent;
  let fixture: ComponentFixture<PackagePermissionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PackagePermissionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PackagePermissionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
