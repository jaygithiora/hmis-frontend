import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { RadiologyCategoriesService } from '@services/dashboard/radiology/radiology-categories/radiology-categories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-radiology-categories',
  templateUrl: './radiology-categories.component.html',
  styleUrl: './radiology-categories.component.scss'
})
export class RadiologyCategoriesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  radiologyCategoryForm!: FormGroup;

  radiology_categories: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private radiologyCategoriesService: RadiologyCategoriesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.radiologyCategoryForm = this.fb.group({
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
    this.radiologyCategoriesService.getRadiologyCategories(page).subscribe((result: any) => {
      this.isLoading = false;
      this.radiology_categories = result.radiology_categories.data;// Set the items
      this.totalItems = result.radiology_categories.total; // Total number of items
      this.perPage = result.radiology_categories.per_page; // Items per page
      this.currentPage = result.radiology_categories.current_page; // Set the current page
      this.toItems = result.radiology_categories.to; // Set to Items
      this.fromItems = result.radiology_categories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, radiology_category: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (radiology_category != null) {
      this.radiologyCategoryForm.get("id").setValue(radiology_category.id);
      this.radiologyCategoryForm.get("name").setValue(radiology_category.name);
      this.radiologyCategoryForm.get("status").setValue(radiology_category.status);
    } else {
      this.radiologyCategoryForm.get("id").setValue(0);
      this.radiologyCategoryForm.get("name").setValue("");
      this.radiologyCategoryForm.get("status").setValue(1);
    }
  }
  addInventoryCategory() {
    if (this.radiologyCategoryForm.valid) {
      this.isLoading = true;
      this.radiologyCategoriesService.updateRadiologyCategories(this.radiologyCategoryForm.getRawValue()).subscribe((result: any) => {

        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if(error?.error?.errors?.code){
          this.toastr.error(error?.error?.errors?.code);
        }
        if(error?.error?.errors?.name){
          this.toastr.error(error?.error?.errors?.name);
        }
        if(error?.error?.errors?.code){
          this.toastr.error(error?.error?.errors?.code);
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

