import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { TriageItemsService } from '@services/dashboard/triage/triage-items/triage-items.service';
import { TriageCategoriesService } from '@services/dashboard/triage/triage-categories/triage-categories.service';

@Component({
  selector: 'app-triage-items',
  templateUrl: './triage-items.component.html',
  styleUrl: './triage-items.component.scss'
})
export class TriageItemsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  triageItemsForm!: FormGroup;

  triage_categories: any[] = [];

  search$ = new Subject<string>();

  selectedOption: any;

  triage_items: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private triageItemsService: TriageItemsService, private triageCategoriesService: TriageCategoriesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.triageItemsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      category: ['', [Validators.required]],
      item_type: ['text', [Validators.required]],
      units: [''],
      min_value: [''],
      max_value: [''],
      required:['1'],
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
        switchMap(term => this.triageCategoriesService.getTriageCategories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.triage_categories = results.triage_categories.data;
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
    this.triageItemsService.getTriageItems(page).subscribe((result: any) => {
      this.isLoading = false;
      this.triage_items = result.triage_items.data;// Set the items
      this.totalItems = result.triage_items.total; // Total number of items
      this.perPage = result.triage_items.per_page; // Items per page
      this.currentPage = result.triage_items.current_page; // Set the current page
      this.toItems = result.triage_items.to; // Set to Items
      this.fromItems = result.triage_items.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, triage_item: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (triage_item != null) {
      this.triage_categories = [];
      this.triageItemsForm.get("id").setValue(triage_item.id);
      this.triageItemsForm.get("name").setValue(triage_item.name);
      if (triage_item.triage_category_id != null) {
        this.triage_categories.push(triage_item.triage_category);
        this.selectedOption = triage_item.triage_category_id;
      }
      this.triageItemsForm.get("item_type").setValue(triage_item.item_types);
      this.triageItemsForm.get("min_value").setValue(triage_item.min_value);
      this.triageItemsForm.get("max_value").setValue(triage_item.max_value);
      this.triageItemsForm.get("units").setValue(triage_item.units);
      this.triageItemsForm.get("required").setValue(triage_item.is_required);
      this.triageItemsForm.get("status").setValue(triage_item.status);
    } else {
      this.triageItemsForm.get("id").setValue(0);
      this.triageItemsForm.get("name").setValue("");
      this.selectedOption = null;
      this.triageItemsForm.get("item_type").setValue("text");
      this.triageItemsForm.get("min_value").setValue("");
      this.triageItemsForm.get("max_value").setValue("");
      this.triageItemsForm.get("units").setValue("");
      this.triageItemsForm.get("required").setValue(1);
      this.triageItemsForm.get("status").setValue("");
      this.triageItemsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.triageItemsForm.valid) {
      this.isLoading = true;
      this.triageItemsService.updateTriageItem(this.triageItemsForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.item_type) {
          this.toastr.error(error?.error?.errors?.item_type);
        }
        if (error?.error?.errors?.min_value) {
          this.toastr.error(error?.error?.errors?.min_value);
        }
        if (error?.error?.errors?.min_value) {
          this.toastr.error(error?.error?.errors?.min_value);
        }
        if (error?.error?.errors?.category) {
          this.toastr.error(error?.error?.errors?.category);
        }
        if (error?.error?.errors?.units) {
          this.toastr.error(error?.error?.errors?.units);
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


