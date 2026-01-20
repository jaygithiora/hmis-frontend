import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NextOfKinRelationsService } from '@services/dashboard/settings/next-of-kin-relations/next-of-kin-relations.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-family-medical-history-form',
  templateUrl: './family-medical-history-form.component.html',
  styleUrl: './family-medical-history-form.component.scss'
})
export class FamilyMedicalHistoryFormComponent implements OnInit, OnChanges {

  @Input({ required: true }) formArray!: FormArray;
  @Input() patientFamilyMedicalHistories: any[] = [];

  loadingFamilyMedicalHistories: boolean = false;

  family_medical_histories: any[] = [];

  searchFamilyMedicalHistories$ = new Subject<string>();

  selectedFamilyMedicalHistoryOption: any;

  familyMedicalHistoryGroup: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private nextOfKinService: NextOfKinRelationsService) {
    /*    this.familyMedicalHistoryGroup = this.fb.group({
          family_medical_history: [null, Validators.required],
          description: ['', Validators.required]
        });*/
    this.setupSearch();
  }

  setupSearch() {

    this.searchFamilyMedicalHistories$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingFamilyMedicalHistories = true),  // Show the loading spinner
        switchMap(term => this.nextOfKinService.getNextOfKinRelations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.family_medical_histories = results.next_of_kin_relations.data;
        this.loadingFamilyMedicalHistories = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newMedicalHistory(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      family_medical_history: [null, [Validators.required]],
      description: ["", [Validators.required]],
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addFamilyMedicalHistory() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all family medical history details before adding a new one.");
      return;
    }
    this.formArray.push(this.newMedicalHistory());
  }

  removeFamilyMedicalHistory(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  familyMedicalHistoryChange($event: any, i: number) {
    console.log("family medical history id", $event.id);

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.family_medical_history === $event.id
    );
    if (exists) {
      this.toastr.error("Family Medical history already added!");
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
      changes['patientFamilyMedicalHistories'] &&
      this.patientFamilyMedicalHistories?.length &&
      this.formArray
    ) {
      this.patientFamilyMedicalHistories.forEach(familyMedicalHistory => {
        this.family_medical_histories.push(familyMedicalHistory.next_of_kin_relation); // Preload existing systems into options
        this.selectedFamilyMedicalHistoryOption = familyMedicalHistory.next_of_kin_relation_id;
        const familyMedicalHistoryGroup = this.fb.group({
          id: [familyMedicalHistory.id || '', []],
          family_medical_history: [familyMedicalHistory.next_of_kin_relation_id || null, Validators.required],
          description: [familyMedicalHistory.description || '', Validators.required],
        });
        this.formArray.push(familyMedicalHistoryGroup);
      });
    }
    //this.isLoading = false;
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
