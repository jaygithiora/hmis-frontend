import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray, AbstractControl, ValidationErrors } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { BloodGroupsService } from '@services/dashboard/masters/blood-groups/blood-groups.service';
import { SalutationService } from '@services/dashboard/masters/salutation/salutation.service';
import { PatientRegistrationService } from '@services/dashboard/patients/patient-registration/patient-registration.service';
import { NextOfKinRelationsService } from '@services/dashboard/settings/next-of-kin-relations/next-of-kin-relations.service';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';
import { OrganizationsService } from '@services/dashboard/organizations/organizations.service';
import { InsurancesService } from '@services/dashboard/masters/insurances/insurances/insurances.service';
import { SchemesService } from '@services/dashboard/masters/insurances/schemes/schemes.service';

@Component({
  selector: 'app-patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss',
})
export class PatientRegistrationComponent implements OnInit, AfterViewInit {
  @ViewChild('locationInput') locationInput!: ElementRef;
  patientImage: WebcamImage;

  public isLoading: boolean = false;
  loading: boolean = false;
  loadingBranches: boolean = false;
  loadingInsurances: boolean = false;
  loadingSchemes: boolean = false;
  loadingSalutation: boolean = false;
  loadingBloodGroup: boolean = false;
  loadingNextOfKinRelation: boolean = false;

  organizations: any[] = [];
  branches: any[] = [];
  schemes: any[] = [];
  insurances: any[] = [];
  salutations: any[] = [];
  blood_groups: any[] = [];
  next_of_kin_relations: any[] = [];
  genders = [{ id: "MALE", name: "MALE" }, { id: "FEMALE", name: "FEMALE" }];
  member_types = [{ id: "PRIMARY", name: "PRIMARY" }, { id: "DEPENDANT", name: "DEPENDANT" }];

  search$ = new Subject<string>();
  searchBranches$ = new Subject<string>();
  searchSalutation$ = new Subject<string>();
  searchSchemes$ = new Subject<{ term: string; insuranceId: number }>();
  searchInsurances$ = new Subject<string>();
  searchBloodGroup$ = new Subject<string>();
  searchNextOfKinRelation$ = new Subject<string>();

  selectedOption: any;
  selectedBranchOption: any;
  selectedSalutationOption: any;
  selectedBloodGroupOption: any;
  selectedNextOfKinRelationOption: any;

  patient: any;
  patientRegistrationForm!: FormGroup;
  imageUrl = 'assets/img/default-profile.png';
  title: string = "Register New Patient"

  constructor(private patientRegistrationService: PatientRegistrationService, private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private organizationService: OrganizationsService, private salutationService: SalutationService,
    private insuranceService: InsurancesService, private schemesService: SchemesService, private bloodGroupService: BloodGroupsService, private nextOfKinRelationService: NextOfKinRelationsService,
    private router: Router, private route: ActivatedRoute) {
    this.patientRegistrationForm = this.fb.group({
      id: ['0', [Validators.required]],
      organization: [null, [Validators.required]],
      branch: [null],
      dob: ['', [Validators.required]],
      salutation: ['', [Validators.required]],
      gender: [null, [Validators.required]],
      first_name: ['', [Validators.required]],
      other_names: ['', [Validators.required]],
      id_number: [''],
      member_number: [''],
      member_type: [null, [Validators.required]],
      patient_schemes: this.fb.array([], [this.minLengthArray(1)]),
      blood_group: [null],
      guardian_name: [null],
      patient_location: ['', [Validators.required]],
      longitude: ['', [Validators.required]],
      latitude: ['', [Validators.required]],
      citizenship: ['National', [Validators.required]],
      next_of_kin_name: ['', [Validators.required]],
      next_of_kin_phone: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      next_of_kin_relation: ['', Validators.required],
      status: ['1', Validators.required]
    });
    this.title = "Register New Patient";

    this.setupSearch();
  }
// Custom validator for FormArray
  minLengthArray(min: number) {
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value.length >= min) {
        return null;
      }
      return { minLengthArray: { requiredLength: min, actualLength: control.value.length } };
    };
  }
  
  setupSearch() {
    this.search$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loading = true),  // Show the loading spinner
        switchMap(term => this.organizationService.getOrganizations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedBranchOption = null;
        this.branches = [];
        this.organizations = results.organizations.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchBranches$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingBranches = true),  // Show the loading spinner
        switchMap(term => this.organizationService.getBranches(1, term, this.selectedOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.branches = results.branches.data;
        this.loadingBranches = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSalutation$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSalutation = true),  // Show the loading spinner
        switchMap(term => this.salutationService.getSalutations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.salutations = results.salutations.data;
        this.loadingSalutation = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchBloodGroup$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingBloodGroup = true),  // Show the loading spinner
        switchMap(term => this.bloodGroupService.getBloodGroups(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.blood_groups = results.blood_groups.data;
        this.loadingBloodGroup = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchNextOfKinRelation$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingNextOfKinRelation = true),  // Show the loading spinner
        switchMap(term => this.nextOfKinRelationService.getNextOfKinRelations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.next_of_kin_relations = results.next_of_kin_relations.data;
        this.loadingNextOfKinRelation = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchInsurances$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingInsurances = true),  // Show the loading spinner
        switchMap(term => this.insuranceService.getInsurances(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.insurances = results.insurances.data;
        this.loadingInsurances = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSchemes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSchemes = true),  // Show the loading spinner
        switchMap(({ term, insuranceId }) => this.schemesService.getSchemes(1, term, insuranceId))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.schemes = results.schemes.data;
        this.loadingSchemes = false;  // Hide the loading spinner when the API call finishes
      });
  }

  get patient_schemes(): FormArray {
    return this.patientRegistrationForm.get('patient_schemes') as FormArray;
  }

  newScheme(): FormGroup {
    this.patient_schemes.markAllAsTouched();
    return this.fb.group({
      id: ['', []],
      insurance: [null, Validators.required],
      scheme: [null, Validators.required],
    });
  }

  addScheme() {
    if(this.patient_schemes.length > 0){
    if (this.patient_schemes.invalid) {
      this.toastr.error("Please fill all allergy details before adding a new one.");
      return;
    }
  }
    this.patient_schemes.push(this.newScheme());
  }

  removeScheme(index: number) {
    this.patient_schemes.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }
  onPatientSelect(event: any) {
    this.title = "Edit Patient Details"
    this.patient = event;
    this.patientRegistrationForm.get("id")?.setValue(this.patient.id);
    if (this.patient.image != null) {
      this.imageUrl = this.patient.image;
    }
    if (this.patient.organization) {
      this.organizations = [];
      this.organizations.push(this.patient.organization);
      this.selectedOption = this.patient.organization_id;
    }
    if (this.patient.branch) {
      this.branches = [];
      this.branches.push(this.patient.branch);
      this.selectedBranchOption = this.patient.branch_id;
    }
    if (this.patient.salutation) {
      this.salutations = [];
      this.salutations.push(this.patient.salutation);
      this.selectedSalutationOption = this.patient.salutation_id;
    }
    if (this.patient.salutation) {
      this.salutations = [];
      this.salutations.push(this.patient.salutation);
      this.selectedSalutationOption = this.patient.salutation_id;
    }
    this.patientRegistrationForm.get("gender")?.setValue(this.patient.gender);
    this.patientRegistrationForm.get("dob")?.setValue(this.patient.dob);
    this.patientRegistrationForm.get("first_name")?.setValue(this.patient.first_name);
    this.patientRegistrationForm.get("other_names")?.setValue(this.patient.other_names);
    this.patientRegistrationForm.get("id_number")?.setValue(this.patient.id_number);
    this.patientRegistrationForm.get("member_number")?.setValue(this.patient.member_number);
    this.patientRegistrationForm.get("id_number")?.setValue(this.patient.id_number);
    this.patientRegistrationForm.get("member_type")?.setValue(this.patient.member_type);
    this.patientRegistrationForm.get("guardian_name")?.setValue(this.patient.guardian_name);

    if (this.patient.blood_group) {
      this.blood_groups = [];
      this.blood_groups.push(this.patient.blood_group);
      this.selectedBloodGroupOption = this.patient.blood_group_id;
    }
    this.patientRegistrationForm.get("patient_location")?.setValue(this.patient.patient_location);
    this.patientRegistrationForm.get("longitude")?.setValue(this.patient.longitude);
    this.patientRegistrationForm.get("latitude")?.setValue(this.patient.latitude);
    this.patientRegistrationForm.get("citizenship")?.setValue(this.patient.citizenship);
    this.patientRegistrationForm.get("phone")?.setValue(this.patient.phone);
    this.patientRegistrationForm.get("email")?.setValue(this.patient.email);
    this.patientRegistrationForm.get("next_of_kin_name")?.setValue(this.patient.next_of_kin_name);
    this.patientRegistrationForm.get("next_of_kin_phone")?.setValue(this.patient.next_of_kin_phone);

    if (this.patient.next_of_kin_relation) {
      this.next_of_kin_relations = [];
      this.next_of_kin_relations.push(this.patient.next_of_kin_relation);
      this.selectedNextOfKinRelationOption = this.patient.next_of_kin_relation_id;
    }
    this.patient.patient_schemes.forEach(scheme => {
        const patientSchemeGroup = this.fb.group({
          id: [scheme.id || '', []],
          insurance: [scheme.scheme.insurance_id || null, Validators.required],
          scheme: [scheme.scheme_id || '', Validators.required],
        });
        this.insurances.push(scheme.scheme.insurance);
        this.schemes.push(scheme.scheme);
        this.patient_schemes.push(patientSchemeGroup);
      });
  }
  // Handle item selection
  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }

  onInsuranceSelect(event: any, index: number) {
    console.log('Selected item:', event);
    console.log('Selected Index:', index);
    const row = this.patient_schemes.at(index) as FormGroup;

    // Clear previously selected scheme
    row.get('scheme')?.setValue(null);

    const insuranceId = parseInt(event?.id ?? "0");
    // Trigger fresh scheme search scoped to this insurance
    this.searchSchemes$.next({
      term: '', insuranceId         // empty = load all schemes for that insurance
    });
  }
onSchemeSearch(term: string, index: number) {
  const insuranceId = this.patient_schemes.at(index).get('insurance')?.value;

  if (!insuranceId) return; // prevent searching without insurance

  this.searchSchemes$.next({ term, insuranceId });
}
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if (id != null) {
      this.isLoading = true;
      this.patientRegistrationService.getPatientRegistration(parseInt(id)).subscribe((result: any) => {
        this.patient = result.patient;
        this.onPatientSelect(this.patient);
        this.isLoading = false;
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    }
  }
  ngAfterViewInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement, {
      types: ['geocode'], // or use ['(cities)'] or ['establishment']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('Selected Place:', place);
      this.patientRegistrationForm.get('patient_location')?.setValue(place.formatted_address || '');
      this.patientRegistrationForm.get('latitude')?.setValue(place.geometry?.location?.lat() || '');
      this.patientRegistrationForm.get('longitude')?.setValue(place.geometry?.location?.lng() || '');
      // You can extract place.geometry.location, place.formatted_address, etc.
    });
  }
  imageCaptured(image: WebcamImage) {
    this.toastr.success("Patient Image Captured!");
    this.patientImage = image;
  }

  updatePatient() {
    if (this.patientRegistrationForm.valid) {
      let formData = new FormData();
      if (this.patientImage != null) {
        // Convert the image data to a Blob
        const blob = this.dataURLtoBlob(this.patientImage.imageAsDataUrl);
        formData = this.createFormData(blob);
      }
      this.isLoading = true;
      this.patientRegistrationService.updatePatientRegistration(this.patientImage != null ? formData : this.patientRegistrationForm.getRawValue()).subscribe((result: any) => {
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["/dashboard/patients/list"]);
        }
        this.isLoading = false;
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.id);
        }
        if (error?.error?.errors?.organization) {
          this.toastr.error(error?.error?.organization);
        }
        if (error?.error?.errors?.patient_schemes) {
          this.toastr.error(error?.error?.patient_schemes);
        }
        if (error?.error?.errors?.blood_group) {
          this.toastr.error(error?.error?.blood_group);
        }
        if (error?.error?.errors?.patient_location) {
          this.toastr.error(error?.error?.patient_location);
        }
        if (error?.error?.errors?.latitude) {
          this.toastr.error(error?.error?.latitude);
        }
        if (error?.error?.errors?.longitude) {
          this.toastr.error(error?.error?.longitude);
        }
        if (error?.error?.errors?.dob) {
          this.toastr.error(error?.error?.dob);
        }
        if (error?.error?.errors?.salutation) {
          this.toastr.error(error?.error?.salutation);
        }
        if (error?.error?.errors?.gender) {
          this.toastr.error(error?.error?.gender);
        }
        if (error?.error?.errors?.first_name) {
          this.toastr.error(error?.error?.first_name);
        }
        if (error?.error?.errors?.other_names) {
          this.toastr.error(error?.error?.other_names);
        }
        if (error?.error?.errors?.id_number) {
          this.toastr.error(error?.error?.id_number);
        }
        if (error?.error?.errors?.member_number) {
          this.toastr.error(error?.error?.member_number);
        }
        if (error?.error?.errors?.member_type) {
          this.toastr.error(error?.error?.member_type);
        }
        if (error?.error?.errors?.guardian_name) {
          this.toastr.error(error?.error?.guardian_name);
        }
        if (error?.error?.errors?.citizenship) {
          this.toastr.error(error?.error?.citizenship);
        }
        if (error?.error?.errors?.next_of_kin_name) {
          this.toastr.error(error?.error?.next_of_kin_name);
        }
        if (error?.error?.errors?.next_of_kin_phone) {
          this.toastr.error(error?.error?.next_of_kin_phone);
        }
        if (error?.error?.errors?.phone) {
          this.toastr.error(error?.error?.phone);
        }
        if (error?.error?.errors?.next_of_kin_relation) {
          this.toastr.error(error?.error?.next_of_kin_relation);
        }
        if (error?.error?.errors?.status) {
          this.toastr.error(error?.error?.status);
        }
        if (error?.error?.error) {
          this.toastr.error(error?.error);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.patientRegistrationForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
  // Convert the base64 image to Blob
  dataURLtoBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
  // Create FormData object to append form values and image
  createFormData(blob: Blob): FormData {
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');

    // Append other form data fields here
    Object.keys(this.patientRegistrationForm.value).forEach(key => {
      formData.append(key, this.patientRegistrationForm.get(key)?.value);
    });

    return formData;
  }
}

