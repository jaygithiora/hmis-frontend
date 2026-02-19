import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdentificationDocumentTypesComponent } from './identification-document-types.component';

describe('IdentificationDocumentTypesComponent', () => {
  let component: IdentificationDocumentTypesComponent;
  let fixture: ComponentFixture<IdentificationDocumentTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [IdentificationDocumentTypesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(IdentificationDocumentTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
