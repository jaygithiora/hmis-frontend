import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { BillingCategoriesService } from '@services/dashboard/settings/billing-categories/billing-categories.service';
import { FeeTypesService } from '@services/dashboard/settings/fee-types/fee-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-billing-categories',
  templateUrl: './billing-categories.component.html',
  styleUrl: './billing-categories.component.scss'
})
export class BillingCategoriesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  billingCategoryForm!: FormGroup;

  billing_categories: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private billingCategoryService: BillingCategoriesService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.billingCategoryForm = this.fb.group({
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
    this.billingCategoryService.getBillingCategories(page).subscribe((result: any) => {
      this.isLoading = false;
      this.billing_categories = result.billing_categories.data;// Set the items
      this.totalItems = result.billing_categories.total; // Total number of items
      this.perPage = result.billing_categories.per_page; // Items per page
      this.currentPage = result.billing_categories.current_page; // Set the current page
      this.toItems = result.billing_categories.to; // Set to Items
      this.fromItems = result.billing_categories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, billing_category: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (billing_category != null) {
      this.billingCategoryForm.get("id").setValue(billing_category.id);
      this.billingCategoryForm.get("name").setValue(billing_category.name);
      this.billingCategoryForm.get("description").setValue(billing_category.description);
    } else {
      this.billingCategoryForm.get("id").setValue(0);
      this.billingCategoryForm.get("name").setValue("");
      this.billingCategoryForm.get("description").setValue("");
    }
  }

  addBillingCategory() {
    if (this.billingCategoryForm.valid) {
      this.isLoading = true;
      this.billingCategoryService.updateBillingCategories(this.billingCategoryForm.getRawValue()).subscribe((result: any) => {
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
      this.billingCategoryForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}



