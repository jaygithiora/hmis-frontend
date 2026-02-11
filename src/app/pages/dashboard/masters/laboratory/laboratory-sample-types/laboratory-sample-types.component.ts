import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { LaboratorySampleTypeService } from '@services/dashboard/laboratory/laboratory-sample-type/laboratory-sample-type.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-laboratory-sample-types',
  templateUrl: './laboratory-sample-types.component.html',
  styleUrl: './laboratory-sample-types.component.scss'
})
export class LaboratorySampleTypesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  sampleTypeForm!: FormGroup;

  sample_types: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private laboratorySampleTypeService: LaboratorySampleTypeService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.sampleTypeForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.laboratorySampleTypeService.getLaboratorySampleTypes(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.sample_types = result.sample_types.data;// Set the items
      this.totalItems = result.sample_types.total; // Total number of items
      this.perPage = result.sample_types.per_page; // Items per page
      this.currentPage = result.sample_types.current_page; // Set the current page
      this.toItems = result.sample_types.to; // Set to Items
      this.fromItems = result.sample_types.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, sample_types: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (sample_types != null) {
      this.sampleTypeForm.get("id").setValue(sample_types.id);
      this.sampleTypeForm.get("name").setValue(sample_types.name);
      this.sampleTypeForm.get("description").setValue(sample_types.description);
    } else {
      this.sampleTypeForm.get("id").setValue(0);
      this.sampleTypeForm.get("name").setValue("");
      this.sampleTypeForm.get("description").setValue("");
    }
  }
  addSampleType() {
    if (this.sampleTypeForm.valid) {
      this.isLoading = true;
      this.laboratorySampleTypeService.updateLaboratorySampleType(this.sampleTypeForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.name) {
          this.toastr.error(error?.error?.errors?.name);
        }
        if (error?.error?.errors?.description) {
          this.toastr.error(error?.error?.errors?.description);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
          this.modalRef?.close();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}