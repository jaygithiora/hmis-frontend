import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { AccountsService } from '@services/dashboard/masters/accounts/accounts.service';
import { ConsultationTypesService } from '@services/dashboard/masters/consultation-types/consultation-types.service';
import { DepartmentsService } from '@services/dashboard/masters/departments/departments.service';
import { MainTypesService } from '@services/dashboard/masters/manin-types/main-types.service';
import { PlansService } from '@services/dashboard/masters/plans/plans.service';
import { SalutationService } from '@services/dashboard/masters/salutation/salutation.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import { OutpatientVisitsService } from '@services/dashboard/outpatient-visits/outpatient-visits.service';
import { PatientRegistrationService } from '@services/dashboard/patients/patient-registration/patient-registration.service';
import { DoctorsService } from '@services/dashboard/masters/doctors/doctors/doctors.service';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { OrganizationsService } from '@services/dashboard/organizations/organizations.service';

@Component({
  selector: 'app-create-op-visit',
  templateUrl: './create-op-visit.component.html',
  styleUrl: './create-op-visit.component.scss'
})
export class CreateOpVisitComponent implements OnInit {
  @ViewChild('locationInput') locationInput!: ElementRef;
  patientImage: WebcamImage;

  public isLoading: boolean = false;
  loading: boolean = false;
  loadingOrganizations: boolean = false;
  loadingBranches: boolean = false;
  loadingSchemes: boolean = false;
  loadingPlan: boolean = false;
  loadingSalutation: boolean = false;
  loadingPatients: boolean = false;
  loadingDepartments: boolean = false;
  loadingDoctors: boolean = false;
  loadingConsultationTypes: boolean = false;

  organizations: any[] = [];
  branches: any[] = [];
  schemes: any[] = [];
  accounts: any[] = [];
  plans: any[] = [];
  salutations: any[] = [];
  patients: any[] = [];
  departments: any[] = [];
  doctors: any[] = [];
  consultation_types: any[] = [];

  search$ = new Subject<string>();
  searchBranches$ = new Subject<string>();
  searchSchemes$ = new Subject<string>();
  searchAccounts$ = new Subject<string>();
  searchPlan$ = new Subject<string>();
  searchSalutation$ = new Subject<string>();
  searchPatient$ = new Subject<string>();
  searchDepartment$ = new Subject<string>();
  searchDoctor$ = new Subject<string>();
  searchConsultationTypes$ = new Subject<string>();

  selectedOption: any;
  selectedBranchOption: any;
  selectedSchemeOption: any;
  selectedAccountOption: any;
  selectedPlanOption: any;
  selectedSalutationOption: any;
  selectedPatientOption: any;
  selectedDepartmentOption: any;
  selectedDoctorOption: any;
  selectedConsultationTypeOption: any;

  patient: any;
  outpatient_visit:any;
  visitForm!: FormGroup;

  imageUrl = 'assets/img/default-profile.png';
  patientId: number = 0;
  visitId: number = 0;

  constructor(private patientRegistrationService:PatientRegistrationService,private outpatientVisitsService: OutpatientVisitsService, private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private organizationsService: OrganizationsService, private activatedRoute: ActivatedRoute,
    private accountService: AccountsService, private subTypeService: SubTypesService, private planService: PlansService,
    private salutationService: SalutationService,private departmentService: DepartmentsService,private doctorsService:DoctorsService,
    private consultationTypesService:ConsultationTypesService,
    private router: Router) {
    this.visitForm = this.fb.group({
      id: ['0', [Validators.required]],
      patient: ['0'],
      patient_code: [],
      organization: [null, [Validators.required]],
      branch: [null, [Validators.required]],
      scheme: [null, [Validators.required]],
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
        switchMap(term => this.organizationsService.getOrganizations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedBranchOption = null;
        this.organizations = results.organizations.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchBranches$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingBranches = true),  // Show the loading spinner
        switchMap(term => this.organizationsService.getBranches(1, term, this.selectedOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.branches = results.branches.data;
        this.loadingBranches = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSchemes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingBranches = true),  // Show the loading spinner
        switchMap(term => this.subTypeService.getSubTypes(1, term, this.selectedBranchOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedAccountOption = null;
        this.schemes = results.schemes.data;
        this.loadingBranches = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchAccounts$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSchemes = true),  // Show the loading spinner
        switchMap(term => this.accountService.getAccounts(1, term, this.selectedSchemeOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedPlanOption = null;
        this.accounts = results.accounts.data;
        this.loadingSchemes = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchPlan$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingPlan = true),  // Show the loading spinner
        switchMap(term => this.planService.getPlans(1, term, this.selectedSchemeOption, this.selectedAccountOption))  // Switch to a new observable for each search term
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
        this.selectedConsultationTypeOption = null;
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
    this.schemes = this.patient.patient_schemes.map(ps => {
  return {
    ...ps,
    id:ps.scheme_id,
    name: `${ps.scheme?.name} (${ps.scheme?.insurance?.name})`
  };
});
    console.log("schemes:", this.schemes);
    this.selectedPatientOption = this.patient.id;
    if (this.patient.image != null) {
      this.imageUrl = this.patient.image;
    }
    if (this.patient.location) {
      this.organizations = [];
      this.organizations.push(this.patient.location);
      this.selectedOption = this.patient.location_id;
    }
    if (this.patient.main_type) {
      this.branches = [];
      this.branches.push(this.patient.main_type);
      this.selectedBranchOption = this.patient.main_type_id;
    }
    if (this.patient.sub_type) {
      this.schemes = [];
      this.schemes.push(this.patient.sub_type);
      this.selectedSchemeOption = this.patient.sub_type_id;
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

  }
  setVisit(event: any) {
    this.patients = [];
    this.visitForm.get("id")?.setValue(this.outpatient_visit.id);
    this.visitForm.get("patient_code")?.setValue(this.outpatient_visit.patient.code);
    this.patients.push({ ...this.outpatient_visit.patient, name: `CODE: ${this.outpatient_visit.patient.code} | NAME: ${this.outpatient_visit.patient.first_name} ${this.outpatient_visit.patient.other_names} | ID: ${this.outpatient_visit.patient.id_number} | PHONE: ${this.outpatient_visit.patient.phone}` });
    this.selectedPatientOption = this.outpatient_visit.patient.id;
    if (this.outpatient_visit.patient.image != null) {
      this.imageUrl = this.outpatient_visit.patient.image;
    }
    if (this.outpatient_visit.location) {
      this.organizations = [];
      this.organizations.push(this.outpatient_visit.location);
      this.selectedOption = this.outpatient_visit.location_id;
    }
    if (this.outpatient_visit.main_type) {
      this.branches = [];
      this.branches.push(this.outpatient_visit.main_type);
      this.selectedBranchOption = this.outpatient_visit.main_type_id;
    }
    if (this.outpatient_visit.sub_type) {
      this.schemes = [];
      this.schemes.push(this.outpatient_visit.sub_type);
      this.selectedSchemeOption = this.outpatient_visit.sub_type_id;
    }
    if (this.outpatient_visit.account) {
      this.accounts = [];
      this.accounts.push(this.outpatient_visit.account);
      this.selectedAccountOption = this.outpatient_visit.account_id;
    }
    if (this.outpatient_visit.plan) {
      this.plans = [];
      this.plans.push(this.outpatient_visit.plan);
      this.selectedPlanOption = this.outpatient_visit.plan_id;
    }
    if (this.outpatient_visit.patient.salutation) {
      this.salutations = [];
      this.salutations.push(this.outpatient_visit.patient.salutation);
      this.selectedSalutationOption = this.outpatient_visit.patient.salutation_id;
    }
    if (this.outpatient_visit.department) {
      this.departments = [];
      this.departments.push(this.outpatient_visit.department);
      this.selectedDepartmentOption = this.outpatient_visit.department_id;
    }
    if (this.outpatient_visit.doctor) {
      this.doctors = [];
      this.doctors.push(this.outpatient_visit.doctor);
      this.selectedDoctorOption = this.outpatient_visit.doctor_id;
    }
    if (this.outpatient_visit.consultation_type) {
      this.consultation_types = [];
      this.consultation_types.push(this.outpatient_visit.consultation_type);
      this.selectedConsultationTypeOption = this.outpatient_visit.consultation_type_id;
    }
    this.visitForm.get("gender")?.setValue(this.outpatient_visit.patient.gender);
    this.visitForm.get("dob")?.setValue(this.outpatient_visit.patient.dob);
    this.visitForm.get("first_name")?.setValue(this.outpatient_visit.patient.first_name);
    this.visitForm.get("other_names")?.setValue(this.outpatient_visit.patient.other_names);
    this.visitForm.get("id_number")?.setValue(this.outpatient_visit.patient.id_number);
    this.visitForm.get("member_number")?.setValue(this.outpatient_visit.patient.member_number);
    this.visitForm.get("id_number")?.setValue(this.outpatient_visit.patient.id_number);
    this.visitForm.get("member_type")?.setValue(this.outpatient_visit.patient.member_type);
    this.visitForm.get("consultation_fees")?.setValue(this.outpatient_visit.consultation_type?.consultation_fees);
    this.visitForm.get("guardian_name")?.setValue(this.outpatient_visit.patient.guardian_name);

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
    }else{
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if(id != null){
      this.visitId = parseInt(id);
      this.isLoading = true;
      this.outpatientVisitsService.getOutpatientVisit(parseInt(id)).subscribe((result: any) => {
        console.log(result);
        this.outpatient_visit = result.outpatient_visit;
        this.setVisit(this.outpatient_visit);
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
  }

  imageCaptured(image: WebcamImage) {
    this.toastr.success("Patient Image Captured!");
    this.patientImage = image;
  }

  updatePatient() {
    if (this.visitForm.valid) {
      /*let formData = new FormData();
      if (this.patientImage != null) {
        // Convert the image data to a Blob
        const blob = this.dataURLtoBlob(this.patientImage.imageAsDataUrl);
        formData = this.createFormData(blob);
      }*/
      this.isLoading = true;
      this.outpatientVisitsService.updateOutpatientVisit(this.visitForm.getRawValue()).subscribe((result: any) => {
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["/dashboard/visits/op/list"]);
        }
        this.isLoading = false;
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.id);
        }
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.location);
        }
        if (error?.error?.errors?.patient) {
          this.toastr.error(error?.error?.patient);
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
        if (error?.error?.errors?.department) {
          this.toastr.error(error?.error?.department);
        }
        if (error?.error?.errors?.doctor) {
          this.toastr.error(error?.error?.doctor);
        }
        if (error?.error?.errors?.consultation_type) {
          this.toastr.error(error?.error?.consultation_type);
        }
        if (error?.error?.errors?.consultation_fees) {
          this.toastr.error(error?.error?.consultation_fees);
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


