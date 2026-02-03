import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { PaymentTypesService } from '@services/dashboard/masters/payments/payment-types/payment-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-types',
  templateUrl: './payment-types.component.html',
  styleUrl: './payment-types.component.scss'
})
export class PaymentTypesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  paymentTypeForm!: FormGroup;

  payment_types: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private paymentTypesService: PaymentTypesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.paymentTypeForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [""]
    });
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.paymentTypesService.getPaymentTypes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.payment_types = result.payment_types.data;// Set the items
      this.totalItems = result.payment_types.total; // Total number of items
      this.perPage = result.payment_types.per_page; // Items per page
      this.currentPage = result.payment_types.current_page; // Set the current page
      this.toItems = result.payment_types.to; // Set to Items
      this.fromItems = result.payment_types.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, payment_mode: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (payment_mode != null) {
      this.paymentTypeForm.get("id").setValue(payment_mode.id);
      this.paymentTypeForm.get("name").setValue(payment_mode.name);
      this.paymentTypeForm.get("description").setValue(payment_mode.description);
    } else {
      this.paymentTypeForm.get("id").setValue(0);
      this.paymentTypeForm.get("name").setValue("");
      this.paymentTypeForm.get("description").setValue("");
    }
  }
  addPaymentType() {
    if (this.paymentTypeForm.valid) {
      this.isLoading = true;
      this.paymentTypesService.updatePaymentType(this.paymentTypeForm.getRawValue()).subscribe((result: any) => {
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
      this.paymentTypeForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

