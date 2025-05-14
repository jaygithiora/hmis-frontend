import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { TriageCategoriesService } from '@services/dashboard/triage/triage-categories/triage-categories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-triage-categories',
  templateUrl: './triage-categories.component.html',
  styleUrl: './triage-categories.component.scss'
})
export class TriageCategoriesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  triageCategoriesForm!: FormGroup;

  triage_categories: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private triageCategoriesService: TriageCategoriesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.triageCategoriesForm = this.fb.group({
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
    this.triageCategoriesService.getTriageCategories(page).subscribe((result: any) => {
      this.isLoading = false;
      this.triage_categories = result.triage_categories.data;// Set the items
      this.totalItems = result.triage_categories.total; // Total number of items
      this.perPage = result.triage_categories.per_page; // Items per page
      this.currentPage = result.triage_categories.current_page; // Set the current page
      this.toItems = result.triage_categories.to; // Set to Items
      this.fromItems = result.triage_categories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, triage_category: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (triage_category != null) {
      this.triageCategoriesForm.get("id").setValue(triage_category.id);
      this.triageCategoriesForm.get("name").setValue(triage_category.name);
      this.triageCategoriesForm.get("status").setValue(triage_category.status);
    } else {
      this.triageCategoriesForm.get("id").setValue(0);
      this.triageCategoriesForm.get("name").setValue("");
      this.triageCategoriesForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.triageCategoriesForm.valid) {
      this.isLoading = true;
      this.triageCategoriesService.updateTriageCategory(this.triageCategoriesForm.getRawValue()).subscribe((result: any) => {
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


