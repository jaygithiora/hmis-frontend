import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DoctorCategoriesService } from '@services/dashboard/masters/doctors/doctor-categories/doctor-categories.service';
import { PaymentTypesService } from '@services/dashboard/masters/payments/payment-types/payment-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-doctor-categories',
  templateUrl: './doctor-categories.component.html',
  styleUrl: './doctor-categories.component.scss'
})
export class DoctorCategoriesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;

  doctorCategoryForm!: FormGroup;

  doctor_categories: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private doctorCategoriesService:DoctorCategoriesService, private modalService: NgbModal, 
    private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.doctorCategoryForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  // Handle item selection
  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.doctorCategoriesService.getDoctorCategories(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.doctor_categories = result.doctor_categories.data;// Set the items
      this.totalItems = result.doctor_categories.total; // Total number of items
      this.perPage = result.doctor_categories.per_page; // Items per page
      this.currentPage = result.doctor_categories.current_page; // Set the current page
      this.toItems = result.doctor_categories.to; // Set to Items
      this.fromItems = result.doctor_categories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, doctor_category: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (doctor_category != null) {
      this.doctorCategoryForm.get("id").setValue(doctor_category.id);
      this.doctorCategoryForm.get("name").setValue(doctor_category.name);
      this.doctorCategoryForm.get("description").setValue(doctor_category.description);
    } else {
      this.doctorCategoryForm.get("id").setValue(0);
      this.doctorCategoryForm.get("name").setValue("");
      this.doctorCategoryForm.get("description").setValue("");
    }
  }
  addDoctorCategory() {
    if (this.doctorCategoryForm.valid) {
      this.isLoading = true;
      this.doctorCategoriesService.updateDoctorCategory(this.doctorCategoryForm.getRawValue()).subscribe((result: any) => {
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
      this.doctorCategoryForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

