import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { RadiologyCategoriesService } from '@services/dashboard/radiology/radiology-categories/radiology-categories.service';
import { RadiologyItemsService } from '@services/dashboard/radiology/radiology-items/radiology-items.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-radiology-items',
  templateUrl: './radiology-items.component.html',
  styleUrl: './radiology-items.component.scss'
})
export class RadiologyItemsComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  radiologyItemsForm!: FormGroup;

  radiology_categories: any[] = [];// Store fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  radiology_items: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private radiologyItemsService: RadiologyItemsService, private radiologyCategoriesService:RadiologyCategoriesService, 
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.radiologyItemsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      radiology_category: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });
    this.setupSearch();
  }

  setupSearch() {
    this.search$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loading = true),  // Show the loading spinner
        switchMap(term => this.radiologyCategoriesService.getRadiologyCategories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.radiology_categories = results.radiology_categories.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
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
    this.radiologyItemsService.getRadiologyItems(page).subscribe((result: any) => {
      this.isLoading = false;
      this.radiology_items = result.radiology_items.data;// Set the items
      this.totalItems = result.radiology_items.total; // Total number of items
      this.perPage = result.radiology_items.per_page; // Items per page
      this.currentPage = result.radiology_items.current_page; // Set the current page
      this.toItems = result.radiology_items.to; // Set to Items
      this.fromItems = result.radiology_items.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, radiology_item: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (radiology_item != null) {
      this.radiologyItemsForm.get("id").setValue(radiology_item.id);
      this.radiologyItemsForm.get("name").setValue(radiology_item.name);
      this.radiology_categories.push(radiology_item.radiology_category);
      this.selectedOption = radiology_item.radiology_category_id;
      this.radiologyItemsForm.get("status").setValue(radiology_item.status);
    } else {
      this.radiologyItemsForm.get("id").setValue(0);
      this.radiologyItemsForm.get("name").setValue("");
      this.selectedOption = null;
      this.radiologyItemsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.radiologyItemsForm.valid) {
      this.isLoading = true;
      this.radiologyItemsService.updateRadiologyItems(this.radiologyItemsForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.radiology_category) {
          this.toastr.error(error?.error?.errors?.radiology_category);
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

