import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { AccountsService } from '@services/dashboard/masters/accounts/accounts.service';
import { MainAccountsService } from '@services/dashboard/masters/main-accounts/main-accounts.service';
import { PlansService } from '@services/dashboard/masters/plans/plans.service';
import { SubAccountsService } from '@services/dashboard/masters/sub-accounts/sub-accounts.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-plans',
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss'
})
export class PlansComponent  implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  planForm!: FormGroup;

  accounts: any[] = [];// Store fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  plans: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private accountService: AccountsService, private planService:PlansService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.planForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      account: ['', [Validators.required]],
      overall_op_limit:[''],
      overall_ip_limit:[''],
      op_visit_limit:[''],
      ip_visit_limit:[''],
      plan_type: ['', [Validators.required]],
      limit_type: ['', [Validators.required]],
      copay_amount: [''],
      copay_percentage:[''],
      copay_percentage_type:[''],
      pharmacy_limit: [],
      lab_limit: [''],
      radiology_limit:[''],
      services_limit:[''],
      start_date: ['', [Validators.required]],
      end_date: ['', [Validators.required]],
      forall: ['1', [Validators.required]],
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
        switchMap(term => this.accountService.getAccounts(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.accounts = results.accounts.data;
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
    this.planService.getPlans(page).subscribe((result: any) => {
      this.isLoading = false;
      this.plans = result.plans.data;// Set the items
      this.totalItems = result.plans.total; // Total number of items
      this.perPage = result.plans.per_page; // Items per page
      this.currentPage = result.plans.current_page; // Set the current page
      this.toItems = result.plans.to; // Set to Items
      this.fromItems = result.plans.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, plan: any) {
    this.modalRef = this.modalService.open(content, { centered: true , size: 'xl'});
    if (plan != null) {
      this.planForm.get("id").setValue(plan.id);
      this.planForm.get("name").setValue(plan.name);
      this.accounts.push(plan.account);
      this.selectedOption = plan.account_id;
      this.planForm.get("plan_type").setValue(plan.plan_type);
      this.planForm.get("limit_type").setValue(plan.limit_type);
      this.planForm.get("copay_amount").setValue(plan.copay_amount);
      this.planForm.get("copay_percentage").setValue(plan.copay_percentage);
      this.planForm.get("copay_percentage_type").setValue(plan.copay_percentage_type);
      this.planForm.get("overall_op_limit").setValue(plan.overall_op_limit);
      this.planForm.get("overall_ip_limit").setValue(plan.overall_ip_limit);
      this.planForm.get("op_visit_limit").setValue(plan.op_visit_limit);
      this.planForm.get("ip_visit_limit").setValue(plan.ip_visit_limit);
      this.planForm.get("pharmacy_limit").setValue(plan.pharmacy_limit);
      this.planForm.get("lab_limit").setValue(plan.lab_limit);
      this.planForm.get("radiology_limit").setValue(plan.radiology_limit);
      this.planForm.get("services_limit").setValue(plan.services_limit);
      this.planForm.get("start_date").setValue(plan.start_date);
      this.planForm.get("end_date").setValue(plan.end_date);
      this.planForm.get("forall").setValue(plan.for_all);
      this.planForm.get("status").setValue(plan.status);
    } else {
      this.planForm.get("id").setValue(0);
      this.planForm.get("name").setValue("");
      this.planForm.get("plan_type").setValue("OP+IP");
      this.planForm.get("limit_type").setValue("Overall");
      this.planForm.get("copay_amount").setValue("");
      this.planForm.get("copay_percentage").setValue("");
      this.planForm.get("copay_percentage_type").setValue("All");
      this.planForm.get("overall_op_limit").setValue("");
      this.planForm.get("overall_ip_limit").setValue("");
      this.planForm.get("op_visit_limit").setValue("");
      this.planForm.get("ip_visit_limit").setValue("");
      this.planForm.get("pharmacy_limit").setValue("");
      this.planForm.get("lab_limit").setValue("");
      this.planForm.get("radiology_limit").setValue("");
      this.planForm.get("services_limit").setValue("");
      this.planForm.get("start_date").setValue("");
      this.planForm.get("end_date").setValue("");
      this.selectedOption = null;
      this.planForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.planForm.valid) {
      this.isLoading = true;
      this.planService.updatePlan(this.planForm.getRawValue()).subscribe((result: any) => {
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
