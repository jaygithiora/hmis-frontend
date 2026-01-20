import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ConsultationService } from '@services/dashboard/consultation/consultation.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-consultation-form',
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss'
})
export class ConsultationFormComponent implements OnInit {
  @ViewChild('consultationSection') consultationSection!: ElementRef;
  @ViewChild('allergySection') allergySection!: ElementRef;
  @ViewChild('reviewOfSystemsSection') reviewOfSystemsSection!: ElementRef;
  @ViewChild('medicalHistorySection') medicalHistorySection!: ElementRef;
  @ViewChild('surgicalHistorySection') surgicalHistorySection!: ElementRef;
  @ViewChild('socialHistorySection') socialHistorySection!: ElementRef;
  @ViewChild('familyMedicalHistorySection') familyMedicalHistorySection!: ElementRef;
  @ViewChild('diagnosisSection') diagnosisSection!: ElementRef;
  @ViewChild('laboratoryTestSection') laboratoryTestSection!: ElementRef;
  @ViewChild('radiologyTestSection') radiologyTestSection!: ElementRef;
  @ViewChild('servicesSection') servicesSection!: ElementRef;
  @ViewChild('prescriptionsSection') prescriptionsSection!: ElementRef;
  @ViewChild('sickLeaveSection') sickLeaveSection!: ElementRef;

  disabled = false;
  isLoading: boolean = true;
  loading: boolean = false;

  consultation: any;

  consultationForm!: FormGroup;

  active = 1;
  activeIds: string = "custom-panel-patient,custom-panel-triage,custom-panel-consultation";
  age: any;


  consultationNotes: string = '';

  labTotals: number = 0;
  radTotals: number = 0;
  serviceTotals: number = 0;
  prescriptionTotals: number = 0;

  patientAllergies: any[] = [];
  patientReviewOfSystems: any[] = [];
  patientMedicalHistories: any[] = [];
  patientSurgicalHistories: any[] = [];
  patientSocialHistories: any[] = [];
  patientFamilyMedicalHistories: any[] = [];
  patientDiagnoses: any[] = [];
  patientLaboratoryTests: any[] = [];
  patientRadiologyTests: any[] = [];
  patientServices: any[] = [];
  patientPrescriptions: any[] = [];
  patientSickLeaves: any[] = [];

  constructor(private consultationService: ConsultationService, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService, private router: Router, private activatedRoute: ActivatedRoute) {
    this.consultationForm = this.fb.group({
      id: ['0', [Validators.required]],
      patient_id: ['', [Validators.required]],
      consultation_id: ['', [Validators.required]],
      consultation_notes: ['', [Validators.required]],
      form_allergies: this.fb.array([]),
      form_systems: this.fb.array([]),
      medical_histories: this.fb.array([]),
      surgeries: this.fb.array([]),
      social_histories: this.fb.array([]),
      family_medical_histories: this.fb.array([]),
      diagnoses: this.fb.array([]),
      lab_rates: this.fb.array([]),
      rad_rates: this.fb.array([]),
      service_rates: this.fb.array([]),
      prescriptions: this.fb.array([]),
      sick_leaves: this.fb.array([]),
    });
  }

  get formAllergies(): FormArray {
    return this.consultationForm.get('form_allergies') as FormArray;
  }

  onConsultationNotesChange(newContent: string) {
    this.consultationForm.get("consultation_notes").setValue(newContent);
    //console.log('Content changed:', newContent);
  }

  get formSystems(): FormArray {
    return this.consultationForm.get('form_systems') as FormArray;
  }

  get formMedicalHistory(): FormArray {
    return this.consultationForm.get('medical_histories') as FormArray;
  }

  get formSurgery(): FormArray {
    return this.consultationForm.get('surgeries') as FormArray;
  }

  get formSocialHistory(): FormArray {
    return this.consultationForm.get('social_histories') as FormArray;
  }

  get formFamilyMedicalHistory(): FormArray {
    return this.consultationForm.get('family_medical_histories') as FormArray;
  }

  get formDiagnosis(): FormArray {
    return this.consultationForm.get('diagnoses') as FormArray;
  }

  get formLabRate(): FormArray {
    return this.consultationForm.get('lab_rates') as FormArray;
  }

  get formRadRate(): FormArray {
    return this.consultationForm.get('rad_rates') as FormArray;
  }

  get formServiceRate(): FormArray {
    return this.consultationForm.get('service_rates') as FormArray;
  }


  get formPrescriptions(): FormArray {
    return this.consultationForm.get('prescriptions') as FormArray;
  }

  get formSickLeave(): FormArray {
    return this.consultationForm.get('sick_leaves') as FormArray;
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.consultationForm.get("consultation_id").setValue(id);
      this.isLoading = true;
      this.consultationService.getConsultation(parseInt(id)).subscribe((result: any) => {
        this.consultation = result.outpatient_consultation;
        this.consultationForm.get("patient_id").setValue(this.consultation?.outpatient_visit?.patient_id);
        this.age = this.getAgeDetails(this.consultation?.outpatient_visit?.patient?.dob);

        this.patientAllergies = this.consultation?.patient_allergies || [];
        this.consultationForm.patchValue({
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
    } else {
      this.router.navigate(["dashboard/consultation/list"]);
    }
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

  addConsultation() {
    if (this.isConsultationEmpty(this.consultationNotes)) {
      this.toastr.error("Consultation notes cannot be empty!");
      this.consultationSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formAllergies.invalid) {
      this.toastr.error("Please fill all allergy details before proceeding!");
      this.allergySection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formSystems.invalid) {
      this.toastr.error("Please fill all review of systems details before proceeding!");
      this.reviewOfSystemsSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formMedicalHistory.invalid) {
      this.toastr.error("Please fill all medical history details before proceeding!");
      this.medicalHistorySection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formSurgery.invalid) {
      this.toastr.error("Please fill all surgical history details before proceeding!");
      this.surgicalHistorySection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formSocialHistory.invalid) {
      this.toastr.error("Please fill all social history details before proceeding!");
      this.socialHistorySection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.formFamilyMedicalHistory.invalid) {
      this.toastr.error("Please fill all family medical history details before proceeding!");
      this.familyMedicalHistorySection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
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
    if (this.formSickLeave.invalid) {
      this.toastr.error("Please fill all sick leave details before proceeding!");
      this.sickLeaveSection.nativeElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
      return;
    }
    if (this.consultationForm.valid) {
      this.isLoading = true;
      this.consultationService.updateConsultation(this.consultationForm.getRawValue()).subscribe((result: any) => {
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