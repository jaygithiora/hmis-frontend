import { AfterViewInit, Component, ElementRef, OnInit, TemplateRef, ViewChild } from '@angular/core';
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
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrl: './organizations.component.scss'
})
export class OrganizationsComponent implements OnInit {

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
  organizationForm!: FormGroup;
  selectedFile: File | null = null;

  roles: any[] = [];
  search$ = new Subject<string>();
  selectedOption: any;

  organizations: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private organizationService: OrganizationsService, private rolesService: RolesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.organizationForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
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
      this.organizationForm.get('location')?.setValue(place.formatted_address || '');
      this.organizationForm.get('latitude')?.setValue(place.geometry?.location?.lat() || '');
      this.organizationForm.get('longitude')?.setValue(place.geometry?.location?.lng() || '');
    });
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.organizationService.getOrganizations(page).subscribe((result: any) => {
      this.isLoading = false;
      this.organizations = result.organizations.data;// Set the items
      this.totalItems = result.organizations.total; // Total number of items
      this.perPage = result.organizations.per_page; // Items per page
      this.currentPage = result.organizations.current_page; // Set the current page
      this.toItems = result.organizations.to; // Set to Items
      this.fromItems = result.organizations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, organization: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    setTimeout(() => {
      if (!this.searchLocation || this.autocompleteInitialized) return;

      this.initAutocomplete();
      this.autocompleteInitialized = true;
    });
    if (organization != null) {
      this.organizationForm.get("id").setValue(organization.id);
      this.organizationForm.get("name").setValue(organization.name);
      this.organizationForm.get("email").setValue(organization.email);
      this.organizationForm.get("phone").setValue(organization.phone);
      this.organizationForm.get("location").setValue(organization.location);
      this.organizationForm.get("longitude").setValue(organization.longitude);
      this.organizationForm.get("latitude").setValue(organization.latitude);
      this.organizationForm.get("address").setValue(organization.address);
      this.organizationForm.get("description").setValue(organization.description);
      this.organizationForm.get("website").setValue(organization.website);
      //this.roles.push(...organization.roles);
      //console.log(organization.roles);
      //this.selectedOption = organization.roles[0]?.id;
      //this.organizationForm.get("status").setValue(organization.status);
    } else {
      this.organizationForm.get("id").setValue(0);
      this.organizationForm.get("name").setValue("");
      this.organizationForm.get("email").setValue("");
      this.organizationForm.get("phone").setValue("");
      this.organizationForm.get("location").setValue("");
      this.organizationForm.get("longitude").setValue("");
      this.organizationForm.get("latitude").setValue("");
      this.organizationForm.get("address").setValue("");
      this.organizationForm.get("description").setValue("");
      this.organizationForm.get("website").setValue("");
      //this.selectedOption = null;
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
    this.organizationForm.patchValue({ logo: file });
  }
  addOrganization() {
    if (this.organizationForm.valid) {
      this.isLoading = true;

      const formData = new FormData();

      Object.entries(this.organizationForm.getRawValue()).forEach(
        ([key, value]: any) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        }
      );
      this.organizationService.addOrganization(formData).subscribe((result: any) => {
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
      this.organizationForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
