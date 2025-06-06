import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { AccountsService } from '@services/dashboard/masters/accounts/accounts.service';
import { BloodGroupsService } from '@services/dashboard/masters/blood-groups/blood-groups.service';
import { HospitalDataService } from '@services/dashboard/masters/hospital-data.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import { MainTypesService } from '@services/dashboard/masters/manin-types/main-types.service';
import { PlansService } from '@services/dashboard/masters/plans/plans.service';
import { SalutationService } from '@services/dashboard/masters/salutation/salutation.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import { PatientRegistrationService } from '@services/dashboard/patients/patient-registration/patient-registration.service';
import { NextOfKinRelationsService } from '@services/dashboard/settings/next-of-kin-relations/next-of-kin-relations.service';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

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
  loadingMainType: boolean = false;
  loadingSubType: boolean = false;
  loadingAccount: boolean = false;
  loadingPlan: boolean = false;
  loadingSalutation: boolean = false;
  loadingBloodGroup: boolean = false;
  loadingNextOfKinRelation: boolean = false;

  locations: any[] = [];
  main_types: any[] = [];
  sub_types: any[] = [];
  accounts: any[] = [];
  plans: any[] = [];
  salutations: any[] = [];
  blood_groups: any[] = [];
  next_of_kin_relations: any[] = [];

  search$ = new Subject<string>();
  searchMainTypes$ = new Subject<string>();
  searchSubTypes$ = new Subject<string>();
  searchAccounts$ = new Subject<string>();
  searchPlan$ = new Subject<string>();
  searchSalutation$ = new Subject<string>();
  searchBloodGroup$ = new Subject<string>();
  searchNextOfKinRelation$ = new Subject<string>();

  selectedOption: any;
  selectedMainTypeOption: any;
  selectedSubTypeOption: any;
  selectedAccountOption: any;
  selectedPlanOption: any;
  selectedSalutationOption: any;
  selectedBloodGroupOption: any;
  selectedNextOfKinRelationOption: any;

  patient: any;
  patientRegistrationForm!: FormGroup;
  imageUrl = 'assets/img/default-profile.png';
  title:string = "Register New Patient"

  constructor(private patientRegistrationService: PatientRegistrationService, private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private locationService: LocationsService, private mainTypeService: MainTypesService,
    private accountService: AccountsService, private subTypeService: SubTypesService, private planService: PlansService,
    private salutationService: SalutationService, private bloodGroupService: BloodGroupsService, private nextOfKinRelationService: NextOfKinRelationsService,
    private router: Router, private route: ActivatedRoute) {
    this.patientRegistrationForm = this.fb.group({
      id: ['0', [Validators.required]],
      location: ['', [Validators.required]],
      main_type: ['', [Validators.required]],
      sub_type: ['', [Validators.required]],
      account: ['', [Validators.required]],
      plan: ['', [Validators.required]],
      //validity: [''],
      //bill_type: [''],
      //copay: [''],
      //limit: [''],
      dob: ['', [Validators.required]],
      salutation: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      other_names: ['', [Validators.required]],
      id_number: [''],
      member_number: [''],
      member_type: ['', [Validators.required]],
      blood_group: [''],
      guardian_name: [''],
      patient_location: ['', [Validators.required]],
      citizenship: ['', [Validators.required]],
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

  setupSearch() {
    this.search$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loading = true),  // Show the loading spinner
        switchMap(term => this.locationService.getLocations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.locations = results.locations.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchMainTypes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingMainType = true),  // Show the loading spinner
        switchMap(term => this.mainTypeService.getMainTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedSubTypeOption = null;
        this.main_types = results.main_types.data;
        this.loadingMainType = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSubTypes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSubType = true),  // Show the loading spinner
        switchMap(term => this.subTypeService.getSubTypes(1, term, this.selectedMainTypeOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedAccountOption = null;
        this.sub_types = results.sub_types.data;
        this.loadingSubType = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchAccounts$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingAccount = true),  // Show the loading spinner
        switchMap(term => this.accountService.getAccounts(1, term, this.selectedSubTypeOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedPlanOption = null;
        this.accounts = results.accounts.data;
        this.loadingAccount = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchPlan$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingPlan = true),  // Show the loading spinner
        switchMap(term => this.planService.getPlans(1, term, this.selectedSubTypeOption, this.selectedAccountOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.plans = results.plans.data;
        this.loadingPlan = false;  // Hide the loading spinner when the API call finishes
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
  }
  onPatientSelect(event: any) {
    this.title = "Edit Patient Details"
    this.patient = event;
    this.patientRegistrationForm.get("id")?.setValue(this.patient.id);
    if (this.patient.image != null) {
      this.imageUrl = this.patient.image;
    }
    if (this.patient.location) {
      this.locations = [];
      this.locations.push(this.patient.location);
      this.selectedOption = this.patient.location_id;
    }
    if (this.patient.main_type) {
      this.main_types = [];
      this.main_types.push(this.patient.main_type);
      this.selectedMainTypeOption = this.patient.main_type_id;
    }
    if (this.patient.sub_type) {
      this.sub_types = [];
      this.sub_types.push(this.patient.sub_type);
      this.selectedSubTypeOption = this.patient.sub_type_id;
    }
    if (this.patient.account) {
      this.accounts = [];
      this.accounts.push(this.patient.account);
      this.selectedAccountOption = this.patient.account_id;
    }
    if (this.patient.plan) {
      this.plans = [];
      this.plans.push(this.patient.plan);
      this.selectedPlanOption = this.patient.plan_id;
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
  }
  // Handle item selection
  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get("id");
    if(id != null){
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
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.location);
        }
        if (error?.error?.errors?.main_type) {
          this.toastr.error(error?.error?.main_type);
        }
        if (error?.error?.errors?.sub_type) {
          this.toastr.error(error?.error?.sub_type);
        }
        if (error?.error?.errors?.account) {
          this.toastr.error(error?.error?.account);
        }
        if (error?.error?.errors?.plan) {
          this.toastr.error(error?.error?.plan);
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
        if (error?.error?.errors?.blood_group) {
          this.toastr.error(error?.error?.blood_group);
        }
        if (error?.error?.errors?.guardian_name) {
          this.toastr.error(error?.error?.guardian_name);
        }
        if (error?.error?.errors?.patient_location) {
          this.toastr.error(error?.error?.patient_location);
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

