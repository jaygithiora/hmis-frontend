import { Component, Input, OnInit } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SurgerySettingsService } from '@services/dashboard/settings/surgery-settings/surgery-settings.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-surgery-history-form',
  templateUrl: './surgery-history-form.component.html',
  styleUrl: './surgery-history-form.component.scss'
})
export class SurgeryHistoryFormComponent implements OnInit {

  @Input({ required: true }) formArray!: FormArray;

  loadingSurgeries: boolean = false;

  surgeries: any[] = [];

  searchSurgeries$ = new Subject<string>();

  selectedSurgeryOption: any;

  surgeryGroup: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService, 
      private surgerySettingsService: SurgerySettingsService,) {
/*this.surgeryGroup = this.fb.group({
      surgery: [null, Validators.required],
      date: ['', Validators.required],
      remarks: ['', Validators.required],
    });*/
    this.setupSearch();
  }

  setupSearch() {
    this.searchSurgeries$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSurgeries = true),  // Show the loading spinner
        switchMap(term => this.surgerySettingsService.getSurgerySettings(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.surgeries = results.surgeries.data;
        this.loadingSurgeries = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newSurgicalHistory(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      surgery: [null, [Validators.required]],
      date: ["", [Validators.required]],
      remarks: ["", [Validators.required]],
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addSurgicalHistory() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all surgical history details before adding a new one.");
      return;
    }
    this.formArray.push(this.newSurgicalHistory());
  }

  removeSurgicalHistory(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  surgeryChange($event: any, i: number) {
    console.log("surgery id", $event.id);

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.surgery === $event.id
    );
    if (exists) {
      this.toastr.error("Surgical history already added!");
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