import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { LaboratoryCategoriesService } from '@services/dashboard/masters/laboratory-categories/laboratory-categories.service';
import { ServiceCategoriesService } from '@services/dashboard/services/service-categories/service-categories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-laboratory-categories',
  templateUrl: './laboratory-categories.component.html',
  styleUrl: './laboratory-categories.component.scss'
})
export class LaboratoryCategoriesComponent implements OnInit {
  private modalRef:NgbModalRef;
  public isLoading: boolean = true;
  labCategoriesForm!: FormGroup;

  laboratory_categories: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private laboratoryCategoryService: LaboratoryCategoriesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.labCategoriesForm = this.fb.group({
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
    this.laboratoryCategoryService.getLaboratoryCategories(page).subscribe((result: any) => {
      this.isLoading = false;
      this.laboratory_categories = result.laboratory_categories.data;// Set the items
      this.totalItems = result.laboratory_categories.total; // Total number of items
      this.perPage = result.laboratory_categories.per_page; // Items per page
      this.currentPage = result.laboratory_categories.current_page; // Set the current page
      this.toItems = result.laboratory_categories.to; // Set to Items
      this.fromItems = result.laboratory_categories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, lab_category: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (lab_category != null) {
      this.labCategoriesForm.get("id").setValue(lab_category.id);
      this.labCategoriesForm.get("name").setValue(lab_category.name);
      this.labCategoriesForm.get("status").setValue(lab_category.status);
    } else {
      this.labCategoriesForm.get("id").setValue(0);
      this.labCategoriesForm.get("name").setValue("");
      this.labCategoriesForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.labCategoriesForm.valid) {
      this.isLoading = true;
      this.laboratoryCategoryService.updateLaboratoryCategories(this.labCategoriesForm.getRawValue()).subscribe((result: any) => {
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
