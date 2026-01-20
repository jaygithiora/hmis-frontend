import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-allergies-form',
  templateUrl: './allergies-form.component.html',
  styleUrl: './allergies-form.component.scss'
})
export class AllergiesFormComponent implements OnInit, OnChanges {
  @Input({ required: true }) formArray!: FormArray;
  @Input() patientAllergies: any[] = [];

  isLoading: boolean = true;
  loading: boolean = false;

  allergies = [{ id: "Drug Allergy", name: "Drug Allergy" }, { id: "Food Allergy", name: "Food Allergy" }, { id: "Other Allergies", name: "Other Allergies" }];
  durations = [{ id: "Year(s)", name: "Year(s)" }, { id: "Month(s)", name: "Month(s)" }, { id: "Day(s)", name: "Day(s)" }];
  severity = [{ id: "Severe", name: "Severe" }, { id: "Mild", name: "Mild" }];
  statuses = [{ id: 1, name: "Active" }, { id: 0, name: "Inactive" }];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router, private activatedRoute: ActivatedRoute) {
    /*this.newAllergyGroup = this.fb.group({
    allergyType: [null, Validators.required],
    allergy: ['', Validators.required],
    sinceWhen: ['', Validators.required],
    duration: [null, Validators.required],
    severity: [null, Validators.required],
    status: [null, Validators.required],
  });*/
  }


  newAllergy(): FormGroup {
    this.formArray.markAllAsTouched();
    return this.fb.group({
      id: ['', []],
      allergyType: [null, Validators.required],
      allergy: ['', Validators.required],
      sinceWhen: ['', Validators.required],
      duration: [null, Validators.required],
      severity: [null, Validators.required],
      status: [null, Validators.required],
    });
  }

  addAllergy() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all allergy details before adding a new one.");
      return;
    }
    this.formArray.push(this.newAllergy());
  }

  removeAllergy(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  ngOnInit() {
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  }

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['patientAllergies'] &&
      this.patientAllergies?.length &&
      this.formArray
    ) {
      this.patientAllergies.forEach(allergy => {
        const allergyGroup = this.fb.group({
          id: [allergy.id || '', []],
          allergyType: [allergy.allergy_type || null, Validators.required],
          allergy: [allergy.allergy || '', Validators.required],
          sinceWhen: [allergy.since_when || '', Validators.required],
          duration: [allergy.duration || null, Validators.required],
          severity: [allergy.severity || null, Validators.required],
          status: [allergy.status || null, Validators.required],
        });
        this.formArray.push(allergyGroup);
      });
    }
    //this.isLoading = false;
  }

  showStatus(id: any): string {
    return this.statuses.find(status => status.id == id)?.name;
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}