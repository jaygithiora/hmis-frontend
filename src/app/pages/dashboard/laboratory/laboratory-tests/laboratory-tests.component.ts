import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { LaboratoryTestsService } from '@services/dashboard/laboratory/laboratory-tests/laboratory-tests.service';
import { LaboratoryCategoriesService } from '@services/dashboard/masters/laboratory-categories/laboratory-categories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-laboratory-tests',
  templateUrl: './laboratory-tests.component.html',
  styleUrl: './laboratory-tests.component.scss'
})
export class LaboratoryTestsComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  laboratoryTestForm!: FormGroup;

  laboratory_categories: any[] = [];// Store fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  laboratory_tests: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private laboratoryCategoriesService: LaboratoryCategoriesService, private laboratoryTestService:LaboratoryTestsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.laboratoryTestForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      laboratory_category: ['', [Validators.required]],
      sample_type: [''],
      amount: ['', [Validators.required]],
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
        switchMap(term => this.laboratoryCategoriesService.getLaboratoryCategories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.laboratory_categories = results.laboratory_categories.data;
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
    this.laboratoryTestService.getLaboratoryTests(page).subscribe((result: any) => {
      this.isLoading = false;
      this.laboratory_tests = result.laboratory_tests.data;// Set the items
      this.totalItems = result.laboratory_tests.total; // Total number of items
      this.perPage = result.laboratory_tests.per_page; // Items per page
      this.currentPage = result.laboratory_tests.current_page; // Set the current page
      this.toItems = result.laboratory_tests.to; // Set to Items
      this.fromItems = result.laboratory_tests.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, laboratory_test: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (laboratory_test != null) {
      this.laboratoryTestForm.get("id").setValue(laboratory_test.id);
      this.laboratoryTestForm.get("name").setValue(laboratory_test.name);
      this.laboratory_categories.push(laboratory_test.laboratory_category);
      this.selectedOption = laboratory_test.laboratory_category_id;
      this.laboratoryTestForm.get("amount").setValue(laboratory_test.amount);
      this.laboratoryTestForm.get("sample_type").setValue(laboratory_test.sample_type);
      this.laboratoryTestForm.get("status").setValue(laboratory_test.status);
    } else {
      this.laboratoryTestForm.get("id").setValue(0);
      this.laboratoryTestForm.get("name").setValue("");
      this.selectedOption = null;
      this.laboratoryTestForm.get("amount").setValue("");
      this.laboratoryTestForm.get("sample_type").setValue("");
      this.laboratoryTestForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.laboratoryTestForm.valid) {
      this.isLoading = true;
      this.laboratoryTestService.updateLaboratoryTests(this.laboratoryTestForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.laboratory_category) {
          this.toastr.error(error?.error?.errors?.laboratory_category);
        }
        if (error?.error?.errors?.sample_type) {
          this.toastr.error(error?.error?.errors?.sample_type);
        }
        if (error?.error?.errors?.amount) {
          this.toastr.error(error?.error?.errors?.amount);
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

