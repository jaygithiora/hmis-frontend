import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { SchemeDepartmentsService } from '@services/dashboard/masters/insurances/scheme-departments/scheme-departments.service';
import { SchemeCopaymentsService } from '@services/dashboard/masters/insurances/scheme-copayments/scheme-copayments.service';
import { SchemesService } from '@services/dashboard/masters/insurances/schemes/schemes.service';

@Component({
  selector: 'app-scheme-copayments',
  templateUrl: './scheme-copayments.component.html',
  styleUrl: './scheme-copayments.component.scss'
})
export class SchemeCopaymentsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingSchemeDepartments: boolean = false;
  loadingSchemes: boolean = false;

  schemeCopaymentForm!: FormGroup;
  deleteSchemeCopaymentForm!: FormGroup;

  schemes: any[] = [];
  scheme_departments: any[] = [];
  fee_value_types = [{ id: "percentage", name: "Percentage" }, { id: "amount", name: "Amount" }];
  computations_on = [{ id: "pay point", name: "Pay Point" }, { id: "final bill", name: "Final Bill" }];

  searchSchemes$ = new Subject<string>();
  searchSchemeDepartments$ = new Subject<string>();

  selectedSchemeDepartment: any;
  selectedScheme: any;

  scheme_copayments: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private schemesService: SchemesService, private schemeDepartmentsService: SchemeDepartmentsService, private schemeCopaymentService: SchemeCopaymentsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService, private usersService: UsersService) {
    this.schemeCopaymentForm = this.fb.group({
      id: ['0', [Validators.required]],
      scheme: [null, [Validators.required]],
      scheme_department: [null, [Validators.required]],
      computation_on: ["final bill", [Validators.required]],
      fee_value_type: ["percentage", [Validators.required]],
      amount: ["", [Validators.required]],
    });
    this.deleteSchemeCopaymentForm = this.fb.group({
      id:['',[Validators.required]],
      scheme:['', [Validators.required]],
      department:['',[Validators.required]]
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
        this.schemes = results.schemes.data;
        this.loadingSchemes = false;  // Hide the loading spinner when the API call finishes
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
        this.scheme_departments = results.scheme_departments.data.map(element => ({
          id: element.id,
          name: `${element.department?.name} (${element.scheme.name})`
        }));
        this.loadingSchemeDepartments = false;  // Hide the loading spinner when the API call finishes
      });
  }
  // Handle item selection
  onSchemeSelect(event: any) {
    console.log('Selected item:', event);
    this.selectedSchemeDepartment = null;
    this.scheme_departments = [];
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
    this.schemeCopaymentService.getSchemeCopayments(page).subscribe((result: any) => {
      this.isLoading = false;
      this.scheme_copayments = result.scheme_copayments.data;// Set the items
      this.totalItems = result.scheme_copayments.total; // Total number of items
      this.perPage = result.scheme_copayments.per_page; // Items per page
      this.currentPage = result.scheme_copayments.current_page; // Set the current page
      this.toItems = result.scheme_copayments.to; // Set to Items
      this.fromItems = result.scheme_copayments.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, schemeDepartment: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (schemeDepartment != null) {
      this.scheme_departments = [];
      this.schemeCopaymentForm.get("id").setValue(schemeDepartment.id);
      this.schemeCopaymentForm.get("fee_value_type").setValue(schemeDepartment.fee_value_type);
      this.schemeCopaymentForm.get("computation_on").setValue(schemeDepartment.computation_on);
      this.schemeCopaymentForm.get("amount").setValue(schemeDepartment.amount);
      if (schemeDepartment.scheme_department?.scheme != null) {
        const scheme = schemeDepartment.scheme_department?.scheme;
        if (scheme && !this.schemes.some(s => s?.id === scheme.id)) {
          this.schemes.push(scheme);
        }
        this.selectedScheme = schemeDepartment.scheme_department.scheme.id;
      }
      if (schemeDepartment.scheme_department_id != null) {
        const scheme_department = schemeDepartment.scheme_department;
        if (scheme_department && !this.scheme_departments.some(s => s?.id === scheme_department.id)) {
          this.scheme_departments.push({ id: schemeDepartment?.id, name: `${schemeDepartment?.scheme_department?.department?.name} (${schemeDepartment?.scheme_department?.scheme?.name})` });
        }
        this.selectedSchemeDepartment = schemeDepartment.scheme_department_id;
      }
    } else {
      this.schemeCopaymentForm.get("id").setValue(0);
      this.schemeCopaymentForm.get("fee_value_type").setValue("percentage");
      this.schemeCopaymentForm.get("computation_on").setValue("final bill");
      this.schemeCopaymentForm.get("amount").setValue("");
      this.selectedSchemeDepartment = null;
      this.selectedScheme = null;
    }
  }
  
  openModal2(content: TemplateRef<any>, schemeDepartment: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    this.deleteSchemeCopaymentForm.get("id").setValue(schemeDepartment.id);
    this.deleteSchemeCopaymentForm.get("department").setValue(schemeDepartment.scheme_department.department.name);
    this.deleteSchemeCopaymentForm.get("scheme").setValue(schemeDepartment.scheme_department.scheme.name);
  }
  
  addSchemeCopayment() {
    if (this.schemeCopaymentForm.valid) {
      this.isLoading = true;
      this.schemeCopaymentService.updateSchemeCopayment(this.schemeCopaymentForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.fee_type_value) {
          this.toastr.error(error?.error?.errors?.fee_type_value);
        }
        if (error?.error?.errors?.computation_on) {
          this.toastr.error(error?.error?.errors?.computation_on);
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
      this.schemeCopaymentForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  deleteSchemeCopayment() {
    if (this.deleteSchemeCopaymentForm.valid) {
      this.isLoading = true;
      this.schemeCopaymentService.deleteSchemeCopayment(this.deleteSchemeCopaymentForm.getRawValue()).subscribe((result: any) => {
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
      this.deleteSchemeCopaymentForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

