import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ConsultationService } from '@services/dashboard/consultation/consultation.service';
import { Parser } from 'expr-eval';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consultation-form',
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss'
})
export class ConsultationFormComponent implements OnInit {
  disabled = false;
  public isLoading: boolean = true;
  loading: boolean = false;

  consultation: any;

  consultationForm!: FormGroup;
  newAllergyGroup: FormGroup;

  active = 1;
  activeIds: string = "custom-panel-patient,custom-panel-triage,custom-panel-consultation";
  age: any;

  allergies = [{id:"Drug Allergy", name:"Drug Allergy"}, {id:"Food Allergy", name:"Food Allergy"}, {id:"Other Allergies", name: "Other Allergies"}];
  durations = [{id:"Year(s)", name:"Year(s)"}, {id:"Month(s)", name:"Month(s)"}, {id:"Day(s)", name: "Day(s)"}];
  severity = [{id:"Severe", name:"Severe"}, {id:"Mild", name:"Mild"}];
  statuses = [{id:"Active", name:"Active"}, {id:"Inactive", name:"Inactive"}];

  constructor(private consultationService: ConsultationService, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router, private activatedRoute: ActivatedRoute, private cdr:ChangeDetectorRef) {
    this.consultationForm = this.fb.group({
      id: ['0', [Validators.required]],
      consultation_id: ['', [Validators.required]],
      form_allergies: this.fb.array([]),
      chief_complaints: ['', [Validators.required]],
      history_complaints: [''],
    });

    this.newAllergyGroup = this.fb.group({
      allergyType: [null, Validators.required],
      allergy: ['', Validators.required],
      sinceWhen: ['', Validators.required],
      duration: [null, Validators.required],
      severity: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  get formAllergies(): FormArray {
    return this.consultationForm.get('form_allergies') as FormArray;
  }

  addFormAllergy() {
    if (this.newAllergyGroup.valid) {
      this.formAllergies.push(this.fb.group(this.newAllergyGroup.value));
      this.newAllergyGroup.reset(); // Clear input fields
    }
  }

  removeAllergy(index: number) {
    this.formAllergies.removeAt(index);
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.consultationForm.get("consultation_id").setValue(id);
      this.isLoading = true;
      this.consultationService.getConsultation(parseInt(id)).subscribe((result: any) => {
        console.log(result);
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



