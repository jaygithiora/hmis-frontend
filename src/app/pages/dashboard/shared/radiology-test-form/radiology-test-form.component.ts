import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { RadiologyItemRatesService } from '@services/dashboard/radiology/radiology-item-rates/radiology-item-rates.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-radiology-test-form',
  templateUrl: './radiology-test-form.component.html',
  styleUrl: './radiology-test-form.component.scss'
})
export class RadiologyTestFormComponent implements OnInit {

  @Input({ required: true }) formArray!: FormArray;
  @Output() totalsChanged = new EventEmitter<number>();

  loadingRadRates: boolean = false;

  rad_rates: any[] = [];

  searchRadRates$ = new Subject<string>();

  selectedRadRateOption: any;

  radRateGroup: FormGroup;

  selectedRadRates: any[] = [];
  radTotals: number = 0;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private radiologyTestRatesService: RadiologyItemRatesService,) {
    /*
    this.radRateGroup = this.fb.group({
      rad_rate: [null, Validators.required]
    });
*/
    this.setupSearch();
  }


  setupSearch() {
    this.searchRadRates$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingRadRates = true),  // Show the loading spinner
        switchMap(term => this.radiologyTestRatesService.getRadiologyItemRates(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.rad_rates = results.radiology_item_rates.data;
        this.loadingRadRates = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newRadRate(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      rad_rate: [null, [Validators.required]],
      rate: ['', []],
      amount: ['', []],
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addRadRate() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all radiology test details before adding a new one.");
      return;
    }
    this.formArray.push(this.newRadRate());
  }

  removeRadRate(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  radRateChange($event: any, i: number) {
    console.log("rad rate id", $event?.id);
    if(!$event) {
      this.formArray.at(i).reset();
      return;
    }

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.rad_rate === $event.id
    );
    if (exists) {
      this.toastr.error("Radiology Test already added!");
      this.formArray.at(i).reset();
      return;
    }
    const group = this.formArray.at(i) as FormGroup;

    group.patchValue({
      rate: $event.amount,
      amount: $event.amount
    });
    console.log("rad rate group", group.value);
  }

  ngOnInit() {
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  this.formArray.valueChanges.subscribe(values => {
    this.radTotals = values.reduce(
      (sum: number, item: any) => sum + (Number(item.amount) || 0),
      0
    );
    this.totalsChanged.emit(this.radTotals);
  });
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
