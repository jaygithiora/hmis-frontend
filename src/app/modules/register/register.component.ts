import {
  Component,
  OnInit,
  Renderer2,
  OnDestroy,
  HostBinding,
  ElementRef,
  ViewChild
} from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { IndexService } from '@services/frontend/index/index.service';
import { ToastrService } from 'ngx-toastr';
import { IntlTelI18n, CountryMap } from 'ngxsmk-tel-input';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  public isLoading = false;
  @ViewChild('searchLocation') searchLocation!: ElementRef<HTMLInputElement>;
  autocompleteInitialized = false;

  @HostBinding('class') class = 'w-100';//'register-box';
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

  public registerForm: FormGroup;
  public organizationForm: FormGroup;
  public packageForm: FormGroup;
  public confirmationForm: FormGroup;

  selectedFile: File | null = null;
  previewUrl: string | null = null;

  public isAuthLoading = false;

  currentStep: number = 1;
  totalSteps: number = 4;

  subscription_packages = [];

  constructor(
    private renderer: Renderer2,
    private toastr: ToastrService,
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private indexService: IndexService
  ) { }

  ngOnInit() {
    /*this.renderer.addClass(
      document.querySelector('app-root'),
      'register-page'
    );*/

    this.initializeForms();
    this.loadSubscriptionPackages(1);
  }

  loadSubscriptionPackages(page: number) {
    this.isLoading = true;
    this.indexService.getSubscriptionPackages(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.subscription_packages = result.subscription_packages.data;// Set the items
      /*this.totalItems = result.subscription_packages.total; // Total number of items
      this.perPage = result.subscription_packages.per_page; // Items per page
      this.currentPage = result.subscription_packages.current_page; // Set the current page
      this.toItems = result.subscription_packages.to; // Set to Items
      this.fromItems = result.subscription_packages.from; // Set from Items*/
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  selectPackage(packageId: number): void {
    this.packageForm.patchValue({ package_id: packageId });
  }

  get selectedPackage(): any {
    const packageId = this.packageForm.get('package_id')?.value;
    return this.subscription_packages.find(p => p.id === packageId);
  }

  initializeForms(): void {

    const packageId = this.route.snapshot.queryParamMap.get('package');
    // Step 1: Account Information
    this.registerForm = this.fb.group({
      firstname: ['', [Validators.required, Validators.minLength(2)]],
      lastname: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(8)]],
      password_confirmation: ['', [Validators.required, Validators.minLength(8)]],
      terms_and_conditions: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordMatchValidator
    });
    // Step 2: Organization Information
    this.organizationForm = this.organizationForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      description: ['', [Validators.required]],
      website: ['', [Validators.required]],
      location: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      organization_email: ['', [Validators.required]],
      organization_phone: ['', [Validators.required]],
      logo: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });
    //Step 3
    this.packageForm = this.fb.group({
      package_id: [packageId, Validators.required]
    });
    // Step 4: Confirmation
    this.confirmationForm = this.fb.group({
      confirmed: [false]
    });
    this.selectPackage(parseInt(packageId));
  }

  // Custom validator for password matching
  passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('password_confirmation')?.value;
    console.log("Running match checker")
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  // Progress percentage
  get progressPercentage(): number {
    return (this.currentStep / this.totalSteps) * 100;
  }
  // Navigation methods
  nextStep(): void {
    if (this.isCurrentStepValid()) {
      if (this.currentStep < this.totalSteps) {
        this.currentStep++;
      }
    } else {
      this.markCurrentStepAsTouched();
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  goToStep(step: number): void {
    if (step <= this.currentStep || this.canNavigateToStep(step)) {
      this.currentStep = step;
    }
    if (this.currentStep === 2) {
      this.initOrganizationStep();
    }
  }

  // Validation methods
  isCurrentStepValid(): boolean {
    switch (this.currentStep) {
      case 1:
        if (!this.organizationForm.get("organization_email")?.value) {
          this.organizationForm.get("organization_email")?.setValue(this.registerForm.get("email")?.value);
        }
        if (!this.organizationForm.get("organization_phone")?.value) {
          this.organizationForm.get("organization_phone")?.setValue(this.registerForm.get("phone")?.value);
        }
        this.markCurrentStepAsTouched();
        return this.registerForm.valid;
      case 2:
        this.markCurrentStepAsTouched();
        return this.organizationForm.valid;
      case 3:
        this.markCurrentStepAsTouched();
        return this.packageForm.valid;
      case 4:
        return true;
      default:
        return false;
    }
  }
  initOrganizationStep() {
    setTimeout(() => {
      if (!this.searchLocation /*|| this.autocompleteInitialized*/) return;
      this.initAutocomplete();
      //this.autocompleteInitialized = true;
    });
  }
  canNavigateToStep(step: number): boolean {
    // Can only navigate to next step if current step is valid
    for (let i = 1; i < step; i++) {
      this.currentStep = i;
      if (!this.isCurrentStepValid()) {
        return false;
      }
    }
    return true;
  }
  markCurrentStepAsTouched(): void {
    switch (this.currentStep) {
      case 1:
        this.markFormGroupTouched(this.registerForm);
        break;
      case 2:
        this.markFormGroupTouched(this.organizationForm);
        break;
      case 3:
        this.markFormGroupTouched(this.packageForm);
        break;
    }
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      formGroup.get(key)?.markAsTouched();
    });
  }
  // Get all form data
  getAllFormData(): any {
    return {
      ...this.registerForm.value,
      ...this.organizationForm.value,
      ...this.packageForm.value
    };
  }
  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // ✅ Validate type
    if (!file.type.startsWith('image/')) {
      this.toastr.error('Only images allowed');
      return;
    }

    // ✅ Validate size (2MB)
    if (file.size > 2 * 1024 * 1024) {
      this.toastr.error('Image must be less than 2MB');
      return;
    }

    this.selectedFile = file;
    this.organizationForm.patchValue({ logo: file });
    // ✅ Create preview
    const reader = new FileReader();
    reader.onload = () => {
      this.previewUrl = reader.result as string;
    };
    reader.readAsDataURL(file);
  }
  async register() {
    if (this.isAllFormsValid()) {
      this.isAuthLoading = true;
      const registrationData = this.getAllFormData();
      const formData = new FormData();

      Object.entries(registrationData).forEach(
        ([key, value]: any) => {
          if (value !== null && value !== undefined) {
            formData.append(key, value);
          }
        });
      console.log('Registration Data:', registrationData);
      this.authService.register(formData).subscribe((result: any) => {
        if (result.access_token && result.user) {
          localStorage.setItem("token", result.access_token);
          localStorage.setItem('user', JSON.stringify(result.user));
          localStorage.setItem('permissions', JSON.stringify(result.permissions));
        } else {
          this.toastr.error("Access token could not be found! Try again!")
        }
        this.router.navigate(['dashboard']);
        this.isAuthLoading = false;
      }, (error: any) => {
        console.log("error", error)
        if (error?.error?.errors) {
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
          if (error?.error?.errors?.password) {
            this.toastr.error(error?.error?.errors?.password);
          }
          if (error?.error?.errors?.password_confirmation) {
            this.toastr.error(error?.error?.errors?.password_confirmation);
          }
          if (error?.error?.errors?.terms_and_conditions) {
            this.toastr.error(error?.error?.errors?.terms_and_conditions);
          }
          if (error?.error?.errors?.logo) {
            this.toastr.error(error?.error?.errors?.logo);
          }
          if (error?.error?.errors?.name) {
            this.toastr.error(error?.error?.errors?.name);
          }
          if (error?.error?.errors?.description) {
            this.toastr.error(error?.error?.errors?.description);
          }
          if (error?.error?.errors?.address) {
            this.toastr.error(error?.error?.errors?.address);
          }
          if (error?.error?.errors?.website) {
            this.toastr.error(error?.error?.errors?.website);
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
          if (error?.error?.errors?.organization_email) {
            this.toastr.error(error?.error?.errors?.organization_email);
          }
          if (error?.error?.errors?.organization_phone) {
            this.toastr.error(error?.error?.errors?.organization_phone);
          }
        } else
          if (error?.error?.error) {
            this.toastr.error(error?.error?.error);
          } else if (error?.message) {
            this.toastr.error(error?.message);

          } else {
            this.toastr.error("Oops! Something went wrong with the server!!");
          }
        this.isAuthLoading = false;
      })
    } else {
      this.toastr.error('Form is not valid!');
    }
  }
  isAllFormsValid(): boolean {
    return this.registerForm.valid &&
      this.organizationForm.valid
  }
  // Helper methods for template
  isStepCompleted(step: number): boolean {
    switch (step) {
      case 1:
        return this.registerForm.valid;
      case 2:
        return this.organizationForm.valid;
      default:
        return false;
    }
  }
  getStepIcon(step: number): string {
    if (this.isStepCompleted(step)) {
      return 'fas fa-check-circle text-success';
    } else if (this.currentStep === step) {
      return 'fas fa-circle text-primary';
    } else {
      return 'far fa-circle text-muted';
    }
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

  ngOnDestroy() {
    this.renderer.removeClass(
      document.querySelector('app-root'),
      'register-page'
    );
  }
}
