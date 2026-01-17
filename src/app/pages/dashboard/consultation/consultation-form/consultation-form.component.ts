import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ConsultationService } from '@services/dashboard/consultation/consultation.service';
import { LaboratoryTestRatesService } from '@services/dashboard/laboratory/laboratory-test-rates/laboratory-test-rates.service';
import { RadiologyItemRatesService } from '@services/dashboard/radiology/radiology-item-rates/radiology-item-rates.service';
import { ServiceRatesService } from '@services/dashboard/services/service-rates/service-rates.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';


@Component({
  selector: 'app-consultation-form',
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss'
})
export class ConsultationFormComponent implements OnInit {
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

  constructor(private consultationService: ConsultationService, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,private router: Router, private activatedRoute: ActivatedRoute) {
    this.consultationForm = this.fb.group({
      id: ['0', [Validators.required]],
      consultation_id: ['', [Validators.required]],
      consultation_notes: ['', [Validators.required]],
      form_allergies: this.fb.array([]),
      form_systems: this.fb.array([]),
      medical_histories: this.fb.array([]),
      chief_complaints: ['', [Validators.required]],
      history_complaints: [''],
      surgeries: this.fb.array([]),
      social_histories: this.fb.array([]),
      family_medical_histories: this.fb.array([]),
      diagnosis: this.fb.array([]),
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
    return this.consultationForm.get('diagnosis') as FormArray;
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
        console.log("VISIT:", result);
        this.consultation = result.outpatient_consultation;
        this.age = this.getAgeDetails(this.consultation?.outpatient_visit?.patient?.dob);
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
    /*if (this.consultationForm.valid) {
      this.isLoading = true;
      this.consultationService.updateTriage(this.triageForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["dashboard/triage/list"])
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.triage_id) {
          this.toastr.error(error?.error?.errors?.triage_id);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        if (error.error.errors) {
          this.handleValidationErrors(error.error.errors);
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }*/
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}