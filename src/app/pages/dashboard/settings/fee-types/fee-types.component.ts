import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { FeeTypesService } from '@services/dashboard/settings/fee-types/fee-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fee-types',
  templateUrl: './fee-types.component.html',
  styleUrl: './fee-types.component.scss'
})
export class FeeTypesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  feeTypeForm!: FormGroup;

  fee_types: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private feeTypeService: FeeTypesService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.feeTypeForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.feeTypeService.getFeeTypes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.fee_types = result.fee_types.data;// Set the items
      this.totalItems = result.fee_types.total; // Total number of items
      this.perPage = result.fee_types.per_page; // Items per page
      this.currentPage = result.fee_types.current_page; // Set the current page
      this.toItems = result.fee_types.to; // Set to Items
      this.fromItems = result.fee_types.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, specialization: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (specialization != null) {
      this.feeTypeForm.get("id").setValue(specialization.id);
      this.feeTypeForm.get("name").setValue(specialization.name);
      this.feeTypeForm.get("description").setValue(specialization.description);
    } else {
      this.feeTypeForm.get("id").setValue(0);
      this.feeTypeForm.get("name").setValue("");
      this.feeTypeForm.get("description").setValue("");
    }
  }

  addFeeType() {
    if (this.feeTypeForm.valid) {
      this.isLoading = true;
      this.feeTypeService.updateFeeType(this.feeTypeForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.status) {
          this.toastr.error(error?.error?.errors?.status);
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
      this.feeTypeForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}



