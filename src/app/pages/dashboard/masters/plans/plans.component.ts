import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { MainAccountsService } from '@services/dashboard/masters/main-accounts/main-accounts.service';
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
  public isLoading: boolean = true;
  loading: boolean = false;

  subAccountForm!: FormGroup;

  main_accounts: any[] = [];// Store fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  sub_accounts: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private subAccountService: SubAccountsService, private mainAccountService: MainAccountsService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.subAccountForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      main_account: ['', [Validators.required]],
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
        switchMap(term => this.mainAccountService.getMainAccounts(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.main_accounts = results.main_accounts.data;
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
    this.subAccountService.getSubAccounts(page).subscribe((result: any) => {
      this.isLoading = false;
      this.sub_accounts = result.sub_accounts.data;// Set the items
      this.totalItems = result.sub_accounts.total; // Total number of items
      this.perPage = result.sub_accounts.per_page; // Items per page
      this.currentPage = result.sub_accounts.current_page; // Set the current page
      this.toItems = result.sub_accounts.to; // Set to Items
      this.fromItems = result.sub_accounts.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, sub_account: any) {
    this.modalService.open(content, { centered: true });
    if (sub_account != null) {
      this.subAccountForm.get("id").setValue(sub_account.id);
      this.subAccountForm.get("name").setValue(sub_account.name);
      this.main_accounts.push(sub_account.main_account);
      this.selectedOption = sub_account.main_account_id
      this.subAccountForm.get("status").setValue(sub_account.status);
    } else {
      this.subAccountForm.get("id").setValue(0);
      this.subAccountForm.get("name").setValue("");
      this.selectedOption = null;
      this.subAccountForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.subAccountForm.valid) {
      this.isLoading = true;
      this.subAccountService.updateSubAccount(this.subAccountForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
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
