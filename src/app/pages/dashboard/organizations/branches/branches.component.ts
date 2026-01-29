import { Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { OrganizationsService } from '@services/dashboard/organizations/organizations.service';
import { RolesService } from '@services/dashboard/users/roles.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { IntlTelI18n, CountryMap } from 'ngxsmk-tel-input';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-branches',
  templateUrl: './branches.component.html',
  styleUrl: './branches.component.scss'
})
export class BranchesComponent implements OnInit {

  @ViewChild('searchLocation') searchLocation!: ElementRef<HTMLInputElement>;
  autocompleteInitialized = false;

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
  branchForm!: FormGroup;
  selectedFile: File | null = null;

  organizations: any[] = [];
  search$ = new Subject<string>();
  selectedOption: any;

  branches: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private organizationService: OrganizationsService, private rolesService: RolesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.branchForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      organization: [null, [Validators.required]],
      address: ['', [Validators.required]],
      description: ['', [Validators.required]],
      website: ['', [Validators.required]],
      location: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      email: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      logo: ['', [Validators.required]],
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
        switchMap(term => this.organizationService.getOrganizations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.organizations = results.organizations.data;
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

  initAutocomplete() {
    const autocomplete = new google.maps.places.Autocomplete(
      this.searchLocation.nativeElement,
      {
        types: ['geocode'], // or ['address']
        componentRestrictions: { country: 'ke' } // Kenya
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();

      console.log('Address:', place.formatted_address);
      console.log('Lat:', place.geometry?.location?.lat());
      console.log('Lng:', place.geometry?.location?.lng());
      this.branchForm.get('location')?.setValue(place.formatted_address || '');
      this.branchForm.get('latitude')?.setValue(place.geometry?.location?.lat() || '');
      this.branchForm.get('longitude')?.setValue(place.geometry?.location?.lng() || '');
    });
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.organizationService.getBranches(page).subscribe((result: any) => {
      this.isLoading = false;
      this.branches = result.branches.data;// Set the items
      this.totalItems = result.branches.total; // Total number of items
      this.perPage = result.branches.per_page; // Items per page
      this.currentPage = result.branches.current_page; // Set the current page
      this.toItems = result.branches.to; // Set to Items
      this.fromItems = result.branches.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, branch: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    setTimeout(() => {
      if (!this.searchLocation || this.autocompleteInitialized) return;

      this.initAutocomplete();
      this.autocompleteInitialized = true;
    });
    if (branch != null) {
      this.branchForm.get("id").setValue(branch.id);
      this.branchForm.get("name").setValue(branch.name);
      this.branchForm.get("email").setValue(branch.email);
      this.branchForm.get("phone").setValue(branch.phone);
      this.branchForm.get("location").setValue(branch.location);
      this.branchForm.get("longitude").setValue(branch.longitude);
      this.branchForm.get("latitude").setValue(branch.latitude);
      this.branchForm.get("address").setValue(branch.address);
      this.branchForm.get("description").setValue(branch.description);
      this.branchForm.get("website").setValue(branch.website);
      this.organizations.push(branch.organization);
      //console.log(branch.roles);
      this.selectedOption = branch.organization_id;
      //this.branchForm.get("status").setValue(branch.status);
    } else {
      this.branchForm.get("id").setValue(0);
      this.branchForm.get("name").setValue("");
      this.branchForm.get("email").setValue("");
      this.branchForm.get("phone").setValue("");
      this.branchForm.get("location").setValue("");
      this.branchForm.get("longitude").setValue("");
      this.branchForm.get("latitude").setValue("");
      this.branchForm.get("address").setValue("");
      this.branchForm.get("description").setValue("");
      this.branchForm.get("website").setValue("");
      this.selectedOption = null;
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // ✅ Validate type
    if (!file.type.startsWith('image/')) {
      alert('Only images allowed');
      return;
    }

    // ✅ Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be less than 2MB');
      return;
    }

    this.selectedFile = file;
    this.branchForm.patchValue({ logo: file });
  }
  addBranch() {
    if (this.branchForm.valid) {
      this.isLoading = true;

      const formData = new FormData();

      Object.entries(this.branchForm.getRawValue()).forEach(
        ([key, value]: any) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
      );
      this.organizationService.addBranch(formData).subscribe((result: any) => {
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
        if (error?.error?.errors?.organization) {
          this.toastr.error(error?.error?.errors?.organization);
        }
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.errors?.location);
        }
        if (error?.error?.errors?.email) {
          this.toastr.error(error?.error?.errors?.email);
        }
        if (error?.error?.errors?.phone) {
          this.toastr.error(error?.error?.errors?.phone);
        }
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.errors?.location);
        }
        if (error?.error?.errors?.longitude) {
          this.toastr.error(error?.error?.errors?.longitude);
        }
        if (error?.error?.errors?.latitude) {
          this.toastr.error(error?.error?.errors?.latitude);
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
      this.branchForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
