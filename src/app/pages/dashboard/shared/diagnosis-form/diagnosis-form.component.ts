import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { IcdsService } from '@services/dashboard/masters/icds/icds.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-diagnosis-form',
  templateUrl: './diagnosis-form.component.html',
  styleUrl: './diagnosis-form.component.scss'
})
export class DiagnosisFormComponent implements OnInit, OnChanges {

  @Input({ required: true }) formArray!: FormArray;
  @Input() patientDiagnoses: any[] = [];

  loadingDiagnosis: boolean = false;

  diagnosis: any[] = [];

  searchDiagnosis$ = new Subject<string>();

  selectedDiagnosisOption: any;

  diagnosisGroup: FormGroup;

  diagnosis_types = [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }];
  diagnosis_levels = [{ id: "Provisional", name: "Provisional" }, { id: "Final", name: "Final" }];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private icdService: IcdsService, ) {
/* 
    this.diagnosisGroup = this.fb.group({
      diagnosis: [null, Validators.required],
      diagnosis_type: ['Primary', Validators.required],
      diagnosis_level: ['Provisional', Validators.required]
    });*/
    this.setupSearch();
  }

  setupSearch() {
    this.searchDiagnosis$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDiagnosis = true),  // Show the loading spinner
        switchMap(term => this.icdService.getICDs(1))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.diagnosis = results.icds.data;
        this.loadingDiagnosis = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newDiagnosis(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      diagnosis: [null, [Validators.required]],
      diagnosis_type: ['Primary', [Validators.required]],
      diagnosis_level: ['Provisional', [Validators.required]],
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addDiagnosis() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all diagnosis details before adding a new one.");
      return;
    }
    this.formArray.push(this.newDiagnosis());
  }

  removeDiagnosis(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  diagnosisChange($event: any, i: number) {
    console.log("diagnosis id", $event.id);

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.diagnosis === $event.id
    );
    if (exists) {
      this.toastr.error("Diagnosis already added!");
      this.formArray.at(i).reset();
      return;
    }
  }

  ngOnInit() {
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['patientDiagnoses'] &&
      this.patientDiagnoses?.length &&
      this.formArray
    ) {
      this.patientDiagnoses.forEach(diagnosis => {
        this.diagnosis.push(diagnosis.icd); // Preload existing systems into options
        this.selectedDiagnosisOption = diagnosis.i_c_d_id;
        const diagnosisGroup = this.fb.group({
          id: [diagnosis.id || '', []],
          diagnosis: [diagnosis.i_c_d_id || null, Validators.required],
          diagnosis_type: [diagnosis.diagnosis_type || 'Primary', Validators.required],
          diagnosis_level: [diagnosis.diagnosis_level || 'Provisional', Validators.required],
        });
        this.formArray.push(diagnosisGroup);
      });
    }
    //this.isLoading = false;
  }
  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}