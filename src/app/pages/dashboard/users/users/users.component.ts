import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { RolesService } from '@services/dashboard/users/roles.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { SearchCountryField, CountryISO, PhoneNumberFormat } from 'ngx-intl-tel-input';
import { ToastrService } from 'ngx-toastr';
import { IntlTelI18n, CountryMap } from 'ngxsmk-tel-input';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent implements OnInit {

  /*SearchCountryField = SearchCountryField;
  CountryISO = CountryISO;
  PhoneNumberFormat = PhoneNumberFormat;*/
  // English UI labels (dropdown/search/ARIA)
  enLabels: IntlTelI18n = {
    selectedCountryAriaLabel: 'Selected country',
    countryListAriaLabel: 'Country list',
    searchPlaceholder: 'Search country',
    zeroSearchResults: 'No results',
    noCountrySelected: 'No country selected'
  };

  // Optional: only override the names you care about
  enCountries: CountryMap = {
    KE: 'Kenya',
    UG: 'Uganda',
    TZ: 'Tanzania'
  };

  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  usersForm!: FormGroup;

  roles: any[] = [];
  search$ = new Subject<string>();
  selectedOption: any;

  users: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private userService: UsersService, private rolesService: RolesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.usersForm = this.fb.group({
      id: ['0', [Validators.required]],
      firstname: ['', [Validators.required]],
      lastname: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      role: ['', [Validators.required]],
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
        switchMap(term => this.rolesService.getRoles(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.roles = results.roles.data;
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
    this.userService.getUsers(page).subscribe((result: any) => {
      this.isLoading = false;
      this.users = result.users.data;// Set the items
      this.totalItems = result.users.total; // Total number of items
      this.perPage = result.users.per_page; // Items per page
      this.currentPage = result.users.current_page; // Set the current page
      this.toItems = result.users.to; // Set to Items
      this.fromItems = result.users.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, user: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (user != null) {
      this.usersForm.get("id").setValue(user.id);
      this.usersForm.get("firstname").setValue(user.firstname);
      this.usersForm.get("lastname").setValue(user.lastname);
      this.usersForm.get("email").setValue(user.email);
      this.usersForm.get("phone").setValue(user.phone);
      this.roles.push(...user.roles);
      console.log(user.roles);
      this.selectedOption = user.roles[0]?.id;
      //this.usersForm.get("status").setValue(user.status);
    } else {
      this.usersForm.get("id").setValue(0);
      this.usersForm.get("firstname").setValue("");
      this.usersForm.get("lastname").setValue("");
      this.usersForm.get("email").setValue("");
      this.usersForm.get("phone").setValue("");
      this.selectedOption = null;
    }
  }
  addLocation() {
    if (this.usersForm.valid) {
      this.isLoading = true;
      this.userService.updateUser(this.usersForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.firstname) {
          this.toastr.error(error?.error?.errors?.firstname);
        }
        if (error?.error?.errors?.lastname) {
          this.toastr.error(error?.error?.errors?.lastname);
        }
        if (error?.error?.errors?.email) {
          this.toastr.error(error?.error?.errors?.email);
        }
        if (error?.error?.errors?.phone) {
          this.toastr.error(error?.error?.errors?.phone);
        }
        if (error?.error?.errors?.role) {
          this.toastr.error(error?.error?.errors?.role);
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
      this.usersForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}


