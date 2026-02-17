import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { SchemeDepartmentsService } from '@services/dashboard/masters/insurances/scheme-departments/scheme-departments.service';
import { SchemeLimitsService } from '@services/dashboard/masters/insurances/scheme-limits/scheme-limits.service';
import { SchemesService } from '@services/dashboard/masters/insurances/schemes/schemes.service';
import { BillingCategoriesService } from '@services/dashboard/settings/billing-categories/billing-categories.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-scheme-limits',
  templateUrl: './scheme-limits.component.html',
  styleUrl: './scheme-limits.component.scss'
})
export class SchemeLimitsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingSchemeDepartments: boolean = false;
  loadingBillingCategories: boolean = false;
  loadingSchemes: boolean = false;

  schemeLimitForm!: FormGroup;
  deleteSchemeLimitForm!: FormGroup;

  scheme_departments: any[] = [];
  billing_categories: any[] = [];
  schemes: any[] = [];
  limit_types = [{ id: "departmental", name: "Departmental" }, { id: "visit", name: "Visit" }];

  searchSchemeDepartments$ = new Subject<string>();
  searchBillingCategories$ = new Subject<string>();
  searchSchemes$ = new Subject<string>();

  selectedSchemeDepartment: any;
  selectedBillingCategory: any;
  selectedScheme: any;

  scheme_limits: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private schemeDepartmentsService: SchemeDepartmentsService, private schemeLimitsService: SchemeLimitsService,
    private billingCategoryService: BillingCategoriesService, private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private schemesService: SchemesService) {
    this.schemeLimitForm = this.fb.group({
      id: ['0', [Validators.required]],
      scheme:[null,[Validators.required]],
      scheme_department: [null, [Validators.required]],
      limit_type: ["visit", [Validators.required]],
      billing_category: [null, [Validators.required]],
      amount: ["", [Validators.required]],
    });

    this.deleteSchemeLimitForm = this.fb.group({
      id: ['', [Validators.required]],
      scheme: ['', [Validators.required]],
      department: ['', [Validators.required]]
    })

    this.setupSearch();
  }

  setupSearch() {
    this.searchSchemes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSchemes = true),  // Show the loading spinner
        switchMap(term => this.schemesService.getSchemes(1, term, "", "Credit"))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.loadingSchemes = false;  // Hide the loading spinner when the API call finishes
        this.schemes = results.schemes.data;
      });
    this.searchSchemeDepartments$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSchemeDepartments = true),  // Show the loading spinner
        switchMap(term => this.schemeDepartmentsService.getSchemeDepartments(1, term, this.selectedScheme, "Credit"))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.loadingSchemeDepartments = false;  // Hide the loading spinner when the API call finishes
        this.scheme_departments = results.scheme_departments.data.map(element => ({
          id: element.id,
          name: `${element.department?.name} (${element.scheme.name})`
        }));
      });
    this.searchBillingCategories$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingBillingCategories = true),  // Show the loading spinner
        switchMap(term => this.billingCategoryService.getBillingCategories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.billing_categories = results.billing_categories.data;
        this.loadingBillingCategories = false;  // Hide the loading spinner when the API call finishes
      });
  }
  // Handle item selection
  onSchemeSelect(event: any) {
    console.log('Selected item:', event);
    this.selectedSchemeDepartment = null;
    this.scheme_departments = [];
  }
  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.schemeLimitsService.getSchemeLimits(page).subscribe((result: any) => {
      this.isLoading = false;
      this.scheme_limits = result.scheme_limits.data;// Set the items
      this.totalItems = result.scheme_limits.total; // Total number of items
      this.perPage = result.scheme_limits.per_page; // Items per page
      this.currentPage = result.scheme_limits.current_page; // Set the current page
      this.toItems = result.scheme_limits.to; // Set to Items
      this.fromItems = result.scheme_limits.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, schemeLimit: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (schemeLimit != null) {
      console.log(schemeLimit);
      this.scheme_departments = [];
      this.billing_categories = [];
      this.schemeLimitForm.get("id").setValue(schemeLimit.id);
      this.schemeLimitForm.get("limit_type").setValue(schemeLimit.limit_type);
      this.schemeLimitForm.get("amount").setValue(schemeLimit.amount);
      if (schemeLimit.scheme_department_id != null) {
        const scheme_department = schemeLimit.scheme_department;
        if (scheme_department && !this.scheme_departments.some(s => s?.id === scheme_department.id)) {
          this.scheme_departments.push({ id: schemeLimit?.id, name: `${schemeLimit?.scheme_department?.department?.name} (${schemeLimit?.scheme_department?.scheme?.name})` });
        }
        this.selectedSchemeDepartment = schemeLimit.id;
      }
      if (schemeLimit.scheme_department.scheme != null) {
        const scheme = schemeLimit.scheme_department?.scheme;
        if (scheme && !this.schemes.some(s => s?.id === scheme.id)) {
          this.schemes.push(scheme);
        }
        this.selectedScheme = schemeLimit.scheme_department?.scheme_id;
      }
      if (schemeLimit.billing_category != null) {
        this.billing_categories.push(schemeLimit.billing_category);
        this.selectedBillingCategory = schemeLimit.billing_category_id;
      }
    } else {
      this.schemeLimitForm.get("id").setValue(0);
      this.schemeLimitForm.get("limit_type").setValue("visit");
      this.schemeLimitForm.get("amount").setValue("");
      this.selectedScheme = null;
      this.selectedSchemeDepartment = null;
      this.selectedBillingCategory = null;
    }
  }

  openModal2(content: TemplateRef<any>, schemeLimit: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    this.deleteSchemeLimitForm.get("id").setValue(schemeLimit.id);
    this.deleteSchemeLimitForm.get("department").setValue(schemeLimit.scheme_department.department.name);
    this.deleteSchemeLimitForm.get("scheme").setValue(schemeLimit.scheme_department.scheme.name);
  }

  addSchemeLimit() {
    if (this.schemeLimitForm.valid) {
      this.isLoading = true;
      this.schemeLimitsService.updateSchemeLimits(this.schemeLimitForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.scheme_department) {
          this.toastr.error(error?.error?.errors?.scheme_department);
        }
        if (error?.error?.errors?.amount) {
          this.toastr.error(error?.error?.errors?.amount);
        }
        if (error?.error?.errors?.limit_type) {
          this.toastr.error(error?.error?.errors?.limit_type);
        }
        if (error?.error?.errors?.billing_category) {
          this.toastr.error(error?.error?.errors?.billing_category);
        }
        if (error?.error?.error) {
          this.toastr.error(error?.error?.error);
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
      this.schemeLimitForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  deleteSchemeLimit() {
    if (this.deleteSchemeLimitForm.valid) {
      this.isLoading = true;
      this.schemeLimitsService.deleteSchemeLimits(this.deleteSchemeLimitForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.error) {
          this.toastr.error(error?.error?.error);
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
      this.schemeLimitForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

