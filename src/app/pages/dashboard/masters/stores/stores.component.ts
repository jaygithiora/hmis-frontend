import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { StoresService } from '@services/dashboard/masters/stores/stores.service';
import { OrganizationsService } from '@services/dashboard/organizations/organizations.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrl: './stores.component.scss'
})
export class StoresComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  loadingBranches: boolean = false;

  storesForm!: FormGroup;

  organizations: any[] = [];// Store fetched items
  branches: any[] = [];// Store fetched items

  selectedOption: any;
  selectedBranch: any;

  search$ = new Subject<string>();
  searchBranch$ = new Subject<string>();

  stores: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private storeService: StoresService, private organizationsService:OrganizationsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, 
    private service: AuthService) {
    this.storesForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      organization: [null, [Validators.required]],
      branch: [null],
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
        switchMap(term => this.organizationsService.getOrganizations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.organizations = results.organizations.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchBranch$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingBranches = true),  // Show the loading spinner
        switchMap(term => this.organizationsService.getBranches(1, term, this.selectedOption))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.branches = results.branches.data;
        this.loadingBranches = false;  // Hide the loading spinner when the API call finishes
      });
  }
  // Handle item selection
  onItemSelect(event: any) {
    //console.log('Selected item:', event);
    this.selectedBranch = null;
    this.branches = [];
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.storeService.getStores(page).subscribe((result: any) => {
      this.isLoading = false;
      this.stores = result.stores.data;// Set the items
      this.totalItems = result.stores.total; // Total number of items
      this.perPage = result.stores.per_page; // Items per page
      this.currentPage = result.stores.current_page; // Set the current page
      this.toItems = result.stores.to; // Set to Items
      this.fromItems = result.stores.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, store: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (store != null) {
      this.storesForm.get("id").setValue(store.id);
      this.storesForm.get("name").setValue(store.name);
      if(store.organization){
        this.organizations = [];
        this.organizations.push(store.organization);
        this.selectedOption = store.organization_id;
      }
      if(store.branch){
        this.branches = [];
        this.branches.push(store.branch);
        this.selectedBranch = store.branch_id;
      }
      this.storesForm.get("status").setValue(store.status);
    } else {
      this.storesForm.get("id").setValue(0);
      this.storesForm.get("name").setValue("");
      this.selectedOption = null;
      this.storesForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.storesForm.valid) {
      this.isLoading = true;
      this.storeService.updateStore(this.storesForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.errors?.location);
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
