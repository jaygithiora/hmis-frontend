import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { AccountsService } from '@services/dashboard/masters/accounts/accounts.service';
import { BloodGroupsService } from '@services/dashboard/masters/blood-groups/blood-groups.service';
import { ConsultationTypesService } from '@services/dashboard/masters/consultation-types/consultation-types.service';
import { DepartmentsService } from '@services/dashboard/masters/departments/departments.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import { MainTypesService } from '@services/dashboard/masters/manin-types/main-types.service';
import { PlansService } from '@services/dashboard/masters/plans/plans.service';
import { SalutationService } from '@services/dashboard/masters/salutation/salutation.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import { PatientRegistrationService } from '@services/dashboard/patients/patient-registration/patient-registration.service';
import { DoctorsService } from '@services/dashboard/settings/doctors/doctors.service';
import { NextOfKinRelationsService } from '@services/dashboard/settings/next-of-kin-relations/next-of-kin-relations.service';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-create-op-visit',
  templateUrl: './create-op-visit.component.html',
  styleUrl: './create-op-visit.component.scss'
})
export class CreateOpVisitComponent implements OnInit, AfterViewInit {
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
  loadingPatients: boolean = false;
  loadingDepartments: boolean = false;
  loadingDoctors: boolean = false;
  loadingConsultationTypes: boolean = false;

  locations: any[] = [];
  main_types: any[] = [];
  sub_types: any[] = [];
  accounts: any[] = [];
  plans: any[] = [];
  salutations: any[] = [];
  blood_groups: any[] = [];
  next_of_kin_relations: any[] = [];
  patients: any[] = [];
  departments: any[] = [];
  doctors: any[] = [];
  consultation_types: any[] = [];

  search$ = new Subject<string>();
  searchMainTypes$ = new Subject<string>();
  searchSubTypes$ = new Subject<string>();
  searchAccounts$ = new Subject<string>();
  searchPlan$ = new Subject<string>();
  searchSalutation$ = new Subject<string>();
  searchBloodGroup$ = new Subject<string>();
  searchNextOfKinRelation$ = new Subject<string>();
  searchPatient$ = new Subject<string>();
  searchDepartment$ = new Subject<string>();
  searchDoctor$ = new Subject<string>();
  searchConsultationTypes$ = new Subject<string>();

  selectedOption: any;
  selectedMainTypeOption: any;
  selectedSubTypeOption: any;
  selectedAccountOption: any;
  selectedPlanOption: any;
  selectedSalutationOption: any;
  selectedBloodGroupOption: any;
  selectedNextOfKinRelationOption: any;
  selectedPatientOption: any;
  selectedDepartmentOption: any;
  selectedDoctorOption: any;
  selectedConsultationTypeOption: any;

  patient: any;
  visitForm!: FormGroup;

  imageUrl = 'assets/img/default-profile.png';
  patientId: number = 0;

  constructor(private patientRegistrationService: PatientRegistrationService, private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private locationService: LocationsService, private mainTypeService: MainTypesService, private activatedRoute: ActivatedRoute,
    private accountService: AccountsService, private subTypeService: SubTypesService, private planService: PlansService,
    private salutationService: SalutationService, private bloodGroupService: BloodGroupsService, private nextOfKinRelationService: NextOfKinRelationsService,
    private departmentService: DepartmentsService,private doctorsService:DoctorsService,private consultationTypesService:ConsultationTypesService,
    private router: Router) {
    this.visitForm = this.fb.group({
      id: ['0', [Validators.required]],
      patient: ['0'],
      patient_code: [],
      location: ['', [Validators.required]],
      main_type: ['', [Validators.required]],
      sub_type: ['', [Validators.required]],
      account: ['', [Validators.required]],
      plan: ['', [Validators.required]],
      department: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      consultation_type:['', [Validators.required]],
      consultation_fees: ['0', [Validators.required]],
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
      status: ['active', Validators.required]
    });

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
    this.searchPatient$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingPatients = true),  // Show the loading spinner
        switchMap(term => this.patientRegistrationService.getPatientRegistrations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.patients = results.patients.data.map((patient: any) => ({ ...patient, name: `CODE: ${patient.code} | NAME: ${patient.first_name} ${patient.other_names} | ID: ${patient.id_number} | PHONE: ${patient.phone}` }));
        this.loadingPatients = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchDepartment$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDepartments = true),  // Show the loading spinner
        switchMap(term => this.departmentService.getDepartments(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedDoctorOption = null;
        this.departments = results.departments.data
        this.loadingDepartments = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchDoctor$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDoctors = true),  // Show the loading spinner
        switchMap(term => this.doctorsService.getDoctors(1, term, this.selectedDepartmentOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.doctors = results.doctors.data
        this.loadingDoctors = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchConsultationTypes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingConsultationTypes = true),  // Show the loading spinner
        switchMap(term => this.consultationTypesService.getConsultationTypes(1, term, this.selectedDoctorOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.consultation_types = results.consultation_types.data
        this.loadingConsultationTypes = false;  // Hide the loading spinner when the API call finishes
      });
  }
  // Handle item selection
  onPatientSelect(event: any) {
    this.patient = event;
    this.patients = [];
    this.visitForm.get("patient_code")?.setValue(this.patient.code);
    this.patients.push({ ...this.patient, name: `CODE: ${this.patient.code} | NAME: ${this.patient.first_name} ${this.patient.other_names} | ID: ${this.patient.id_number} | PHONE: ${this.patient.phone}` });
    this.selectedPatientOption = this.patient.id;
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
    this.visitForm.get("gender")?.setValue(this.patient.gender);
    this.visitForm.get("dob")?.setValue(this.patient.dob);
    this.visitForm.get("first_name")?.setValue(this.patient.first_name);
    this.visitForm.get("other_names")?.setValue(this.patient.other_names);
    this.visitForm.get("id_number")?.setValue(this.patient.id_number);
    this.visitForm.get("member_number")?.setValue(this.patient.member_number);
    this.visitForm.get("id_number")?.setValue(this.patient.id_number);
    this.visitForm.get("member_type")?.setValue(this.patient.member_type);
    this.visitForm.get("guardian_name")?.setValue(this.patient.guardian_name);

    if (this.patient.blood_group) {
      this.blood_groups = [];
      this.blood_groups.push(this.patient.blood_group);
      this.selectedBloodGroupOption = this.patient.blood_group_id;
    }
    this.visitForm.get("patient_location")?.setValue(this.patient.patient_location);
    this.visitForm.get("citizenship")?.setValue(this.patient.citizenship);
    this.visitForm.get("phone")?.setValue(this.patient.phone);
    this.visitForm.get("email")?.setValue(this.patient.email);
    this.visitForm.get("next_of_kin_name")?.setValue(this.patient.next_of_kin_name);
    this.visitForm.get("next_of_kin_phone")?.setValue(this.patient.next_of_kin_phone);

    if (this.patient.next_of_kin_relation) {
      this.next_of_kin_relations = [];
      this.next_of_kin_relations.push(this.patient.next_of_kin_relation);
      this.selectedNextOfKinRelationOption = this.patient.next_of_kin_relation_id;
    }
  }
  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }
  onConsultationTypeSelect(event: any) {
    this.visitForm.get("consultation_fees")?.setValue(event.consultation_fees);
    console.log('Consultation Type item:', event);
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("patient_id");
    if (id != null) {
      this.patientId = parseInt(id);
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
    if (this.visitForm.valid) {
      let formData = new FormData();
      if (this.patientImage != null) {
        // Convert the image data to a Blob
        const blob = this.dataURLtoBlob(this.patientImage.imageAsDataUrl);
        formData = this.createFormData(blob);
      }
      this.isLoading = true;
      this.patientRegistrationService.updatePatientRegistration(this.patientImage != null ? formData : this.visitForm.getRawValue()).subscribe((result: any) => {
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
    Object.keys(this.visitForm.value).forEach(key => {
      formData.append(key, this.visitForm.get(key)?.value);
    });

    return formData;
  }
}


