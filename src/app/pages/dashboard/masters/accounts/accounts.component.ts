import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { AccountsService } from '@services/dashboard/masters/accounts/accounts.service';
import { SubAccountsService } from '@services/dashboard/masters/sub-accounts/sub-accounts.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrl: './accounts.component.scss'
})
export class AccountsComponent implements OnInit {
  private modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  loadingSubTypes: boolean = false;

  accountsForm!: FormGroup;

  sub_accounts: any[] = [];// Store fetched items
  sub_types: any[] = [];// Store fetched items

  selectedOption: any;
  selectedSubTypeOption: any;

  search$ = new Subject<string>();
  searchSubType$ = new Subject<string>();

  accounts: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private subAccountService: SubAccountsService, private accountService: AccountsService, private subTypeService:SubTypesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.accountsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      sub_type:[''],
      sub_account: ['', [Validators.required]],
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
        switchMap(term => this.subAccountService.getSubAccounts(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.sub_accounts = results.sub_accounts.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
      this.searchSubType$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loadingSubTypes = true),  // Show the loading spinner
          switchMap(term => this.subTypeService.getSubTypes(1, term))  // Switch to a new observable for each search term
        )
        .subscribe(results => {
          this.sub_types = results.sub_types.data;
          this.loadingSubTypes = false;  // Hide the loading spinner when the API call finishes
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
    this.accountService.getAccounts(page).subscribe((result: any) => {
      this.isLoading = false;
      this.accounts = result.accounts.data;// Set the items
      this.totalItems = result.accounts.total; // Total number of items
      this.perPage = result.accounts.per_page; // Items per page
      this.currentPage = result.accounts.current_page; // Set the current page
      this.toItems = result.accounts.to; // Set to Items
      this.fromItems = result.accounts.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, account: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (account != null) {
      this.sub_types =[];
      this.sub_accounts = [];
      this.accountsForm.get("id").setValue(account.id);
      this.accountsForm.get("name").setValue(account.name);
      this.sub_accounts.push(account.sub_account);
      this.selectedOption = account.sub_account_id;
      if(account.sub_type!=null){
      this.sub_types.push(account.sub_type);
      }
      this.selectedSubTypeOption = account.sub_type_id;
      this.accountsForm.get("status").setValue(account.status);
    } else {
      this.accountsForm.get("id").setValue(0);
      this.accountsForm.get("name").setValue("");
      this.selectedOption = null;
      this.accountsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.accountsForm.valid) {
      this.isLoading = true;
      this.accountService.updateAccount(this.accountsForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.sub_type) {
          this.toastr.error(error?.error?.errors?.sub_type);
        }
        if (error?.error?.errors?.sub_account) {
          this.toastr.error(error?.error?.errors?.sub_account);
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
