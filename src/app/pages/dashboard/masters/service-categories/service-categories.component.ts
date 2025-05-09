import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ServiceCategoriesService } from '@services/dashboard/masters/service-categories/service-categories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-service-categories',
  templateUrl: './service-categories.component.html',
  styleUrl: './service-categories.component.scss'
})
export class ServiceCategoriesComponent implements OnInit {
  private modalRef:NgbModalRef;
  public isLoading: boolean = true;
  serviceCategoryForm!: FormGroup;

  service_categories: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private serviceCategoryService: ServiceCategoriesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.serviceCategoryForm = this.fb.group({
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
    this.serviceCategoryService.getServiceCategories(page).subscribe((result: any) => {
      this.isLoading = false;
      this.service_categories = result.service_categories.data;// Set the items
      this.totalItems = result.service_categories.total; // Total number of items
      this.perPage = result.service_categories.per_page; // Items per page
      this.currentPage = result.service_categories.current_page; // Set the current page
      this.toItems = result.service_categories.to; // Set to Items
      this.fromItems = result.service_categories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, service_category: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (service_category != null) {
      this.serviceCategoryForm.get("id").setValue(service_category.id);
      this.serviceCategoryForm.get("name").setValue(service_category.name);
      this.serviceCategoryForm.get("status").setValue(service_category.status);
    } else {
      this.serviceCategoryForm.get("id").setValue(0);
      this.serviceCategoryForm.get("name").setValue("");
      this.serviceCategoryForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.serviceCategoryForm.valid) {
      this.isLoading = true;
      this.serviceCategoryService.updateServiceCategory(this.serviceCategoryForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if(error?.error?.errors?.id){
          this.toastr.error(error?.error?.errors?.id);
        }
        if(error?.error?.errors?.name){
          this.toastr.error(error?.error?.errors?.name);
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
