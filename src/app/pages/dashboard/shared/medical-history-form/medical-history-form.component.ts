import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MedicalHistoriesService } from '@services/dashboard/settings/medical-histories/medical-histories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-medical-history-form',
  templateUrl: './medical-history-form.component.html',
  styleUrl: './medical-history-form.component.scss'
})
export class MedicalHistoryFormComponent implements OnInit {

  @Input({ required: true }) formArray!: FormArray;

  loadingMedicalHistories: boolean = false;

  medicalHistories: any[] = [];

  searchMedicalHistories$ = new Subject<string>();

  selectedMedicalHistoryOption: any;

  medicalHistoryGroup: FormGroup;

  private updating = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private medicalHistoryService: MedicalHistoriesService) {
/*
    
    this.medicalHistoryGroup = this.fb.group({
      medical_history: [null, Validators.required],
      remarks: ['', Validators.required],
    });*/
    this.setupSearch();
  }

  setupSearch() {
    this.searchMedicalHistories$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingMedicalHistories = true),  // Show the loading spinner
        switchMap(term => this.medicalHistoryService.getMedicalHistories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.medicalHistories = results.medical_histories.data;
        this.loadingMedicalHistories = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newMedicalHistory(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      medical_history: [null, [Validators.required]],
      remarks: ["", [Validators.required]],
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addMedicalHistory() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all medical history details before adding a new one.");
      return;
    }
    this.formArray.push(this.newMedicalHistory());
  }

  removeMedicalHistory(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  medicalHistoryChange($event: any, i: number) {
    console.log("medical history id", $event.id);

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.medical_history === $event.id
    );
    if (exists) {
      this.toastr.error("Medical history already added!");
      this.formArray.at(i).reset();
      return;
    }
  }

  ngOnInit() {
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}