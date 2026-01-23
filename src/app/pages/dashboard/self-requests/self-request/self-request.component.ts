import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ConsultationService } from '@services/dashboard/consultation/consultation.service';
import { PatientRegistrationService } from '@services/dashboard/patients/patient-registration/patient-registration.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-self-request',
  templateUrl: './self-request.component.html',
  styleUrl: './self-request.component.scss'
})
export class SelfRequestComponent implements OnInit {
  @ViewChild('diagnosisSection') diagnosisSection!: ElementRef;
  @ViewChild('laboratoryTestSection') laboratoryTestSection!: ElementRef;
  @ViewChild('radiologyTestSection') radiologyTestSection!: ElementRef;
  @ViewChild('servicesSection') servicesSection!: ElementRef;
  @ViewChild('prescriptionsSection') prescriptionsSection!: ElementRef;

  disabled = false;
  isLoading: boolean = false;
  loading: boolean = false;
  loadingPatients: boolean = false;

  patient: any;
  patients: any[] = [];

  searchPatients$ = new Subject<string>();

  selectedPatientOption: any;

  consultation: any;

  selfRequestForm!: FormGroup;

  active = 1;
  activeIds: string = "custom-panel-patient,custom-panel-triage,custom-panel-consultation";
  age: any;


  labTotals: number = 0;
  radTotals: number = 0;
  serviceTotals: number = 0;
  prescriptionTotals: number = 0;

  patientDiagnoses: any[] = [];
  patientLaboratoryTests: any[] = [];
  patientRadiologyTests: any[] = [];
  patientServices: any[] = [];
  patientPrescriptions: any[] = [];

  constructor(private consultationService: ConsultationService, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private patientService: PatientRegistrationService) {
    this.selfRequestForm = this.fb.group({
      id: ['0', [Validators.required]],
      patient_id: [null, [Validators.required]],
      diagnoses: this.fb.array([]),
      lab_rates: this.fb.array([]),
      rad_rates: this.fb.array([]),
      service_rates: this.fb.array([]),
      prescriptions: this.fb.array([]),
    });
    this.setupSearch();
  }

  setupSearch() {
    this.searchPatients$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingPatients = true),  // Show the loading spinner
        switchMap(term => this.patientService.getPatientRegistrations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.patients = results.patients.data.map(p => ({
          ...p,
          display: `${p.first_name} - ${p.other_names} (${p.code})`
        }));;
        this.loadingPatients = false;  // Hide the loading spinner when the API call finishes
      });
  }

  patientChange($event: any) {
    console.log("patient id", $event?.id);
    this.patient = $event;
    this.age = this.getAgeDetails(this.patient?.dob);
  }

  get formDiagnosis(): FormArray {
    return this.selfRequestForm.get('diagnoses') as FormArray;
  }

  get formLabRate(): FormArray {
    return this.selfRequestForm.get('lab_rates') as FormArray;
  }

  get formRadRate(): FormArray {
    return this.selfRequestForm.get('rad_rates') as FormArray;
  }

  get formServiceRate(): FormArray {
    return this.selfRequestForm.get('service_rates') as FormArray;
  }


  get formPrescriptions(): FormArray {
    return this.selfRequestForm.get('prescriptions') as FormArray;
  }


  ngOnInit() {
    /*const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.selfRequestForm.get("consultation_id").setValue(id);
      this.isLoading = true;
      this.consultationService.getConsultation(parseInt(id)).subscribe((result: any) => {
        this.consultation = result.outpatient_consultation;
        this.selfRequestForm.get("patient_id").setValue(this.consultation?.outpatient_visit?.patient_id);
        this.age = this.getAgeDetails(this.consultation?.outpatient_visit?.patient?.dob);

        this.patientAllergies = this.consultation?.patient_allergies || [];
        this.selfRequestForm.patchValue({
          consultation_notes: this.consultation?.consultation_note?.notes || "",
        });
        this.consultationNotes = this.consultation?.consultation_note?.notes || "";
        this.patientReviewOfSystems = this.consultation?.patient_review_of_systems || [];
        this.patientMedicalHistories = this.consultation?.patient_medical_histories || [];
        this.patientSurgicalHistories = this.consultation?.patient_surgical_histories || [];
        this.patientSocialHistories = this.consultation?.patient_social_histories || [];
        this.patientFamilyMedicalHistories = this.consultation?.patient_family_medical_histories || [];
        this.patientDiagnoses = this.consultation?.patient_diagnoses || [];
        this.patientLaboratoryTests = this.consultation?.patient_laboratory_tests || [];
        this.patientRadiologyTests = this.consultation?.patient_radiology_tests || [];
        this.patientServices = this.consultation?.patient_services || [];
        this.patientPrescriptions = this.consultation?.patient_prescriptions || [];
        this.patientSickLeaves = this.consultation?.patient_sick_leaves || [];

        //console.log("consultation", this.consultation);
        this.isLoading = false;
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    } */
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  }



  getAgeDetails(dob: string) {
    const birthDate = moment(dob);
    const today = moment();

    const years = today.diff(birthDate, 'years');
    birthDate.add(years, 'years');

    const months = today.diff(birthDate, 'months');
    birthDate.add(months, 'months');

    const days = today.diff(birthDate, 'days');

    return { years, months, days };
  }

  addSelfRequest() {
    if (this.formDiagnosis.invalid) {
      this.toastr.error("Please fill all diagnosis details before proceeding!");
      this.diagnosisSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formLabRate.invalid) {
      this.toastr.error("Please fill all laboratory test details before proceeding!");
      this.laboratoryTestSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formRadRate.invalid) {
      this.toastr.error("Please fill all radiology rate details before proceeding!");
      this.radiologyTestSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formServiceRate.invalid) {
      this.toastr.error("Please fill all services/procedures rate details before proceeding!");
      this.servicesSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formPrescriptions.invalid) {
      this.toastr.error("Please fill all prescriptions details before proceeding!");
      this.prescriptionsSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.selfRequestForm.valid) {
      this.isLoading = true;
      this.consultationService.updateConsultation(this.selfRequestForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["dashboard/consultation/list"])
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.consultation_id) {
          this.toastr.error(error?.error?.errors?.consultation_id);
        }
        if (error?.error?.errors?.patient_id) {
          this.toastr.error(error?.error?.errors?.patient_id);
        }
        if (error?.error?.errors?.consultation_notes) {
          this.toastr.error(error?.error?.errors?.consultation_notes);
        }
        if (error?.error?.errors?.consultation_notes) {
          this.toastr.error(error?.error?.errors?.consultation_notes);
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

  isConsultationEmpty(html: string): boolean {
    if (!html) return true;

    // Remove HTML tags
    const text = html
      .replace(/<[^>]*>/g, '')   // remove tags
      .replace(/&nbsp;/g, ' ')   // replace nbsp
      .trim();                   // trim spaces

    return text.length === 0;
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
