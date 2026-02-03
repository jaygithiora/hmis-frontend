import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { PaymentModesService } from '@services/dashboard/masters/payments/payment-modes/payment-modes.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-payment-modes',
  templateUrl: './payment-modes.component.html',
  styleUrl: './payment-modes.component.scss'
})
export class PaymentModesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  paymentModesForm!: FormGroup;

  payment_modes: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private paymentModesService: PaymentModesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.paymentModesForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.paymentModesService.getPaymentModes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.payment_modes = result.payment_modes.data;// Set the items
      this.totalItems = result.payment_modes.total; // Total number of items
      this.perPage = result.payment_modes.per_page; // Items per page
      this.currentPage = result.payment_modes.current_page; // Set the current page
      this.toItems = result.payment_modes.to; // Set to Items
      this.fromItems = result.payment_modes.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, payment_mode: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (payment_mode != null) {
      this.paymentModesForm.get("id").setValue(payment_mode.id);
      this.paymentModesForm.get("name").setValue(payment_mode.name);
      this.paymentModesForm.get("status").setValue(payment_mode.status);
    } else {
      this.paymentModesForm.get("id").setValue(0);
      this.paymentModesForm.get("name").setValue("");
      this.paymentModesForm.get("status").setValue(1);
    }
  }
  addPaymentMode() {
    if (this.paymentModesForm.valid) {
      this.isLoading = true;
      this.paymentModesService.updatePaymentMode(this.paymentModesForm.getRawValue()).subscribe((result: any) => {
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
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

