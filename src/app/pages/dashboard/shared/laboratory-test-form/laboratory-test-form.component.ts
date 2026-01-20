import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LaboratoryTestRatesService } from '@services/dashboard/laboratory/laboratory-test-rates/laboratory-test-rates.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-laboratory-test-form',
  templateUrl: './laboratory-test-form.component.html',
  styleUrl: './laboratory-test-form.component.scss'
})
export class LaboratoryTestFormComponent implements OnInit ,OnChanges{

  @Input({ required: true }) formArray!: FormArray;
  @Output() totalsChanged = new EventEmitter<number>();
  @Input() patientLaboratoryTests: any[] = [];

  loadingLabRates: boolean = false;

  lab_rates: any[] = [];

  searchLabRates$ = new Subject<string>();

  selectedLabRateOption: any;

  labRateGroup: FormGroup;

  selectedLabRates: any[] = [];
  labTotals: number = 0;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private laboratoryTestRatesService: LaboratoryTestRatesService,) {
    /*
    this.labRateGroup = this.fb.group({
      lab_rate: [null, Validators.required]
    });
*/
    this.setupSearch();
  }


  setupSearch() {
    this.searchLabRates$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingLabRates = true),  // Show the loading spinner
        switchMap(term => this.laboratoryTestRatesService.getLaboratoryTestRates(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.lab_rates = results.laboratory_test_rates.data;
        this.loadingLabRates = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newLabRate(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      lab_rate: [null, [Validators.required]],
      rate: ['', []],
      amount: ['', []],
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addLabRate() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all laboratory test details before adding a new one.");
      return;
    }
    this.formArray.push(this.newLabRate());
  }

  removeLabRate(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  labRateChange($event: any, i: number) {
    console.log("lab rate id", $event?.id);
    if (!$event) {
      this.formArray.at(i).reset();
      return;
    }

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.lab_rate === $event.id
    );
    if (exists) {
      this.toastr.error("Laboratory Test already added!");
      this.formArray.at(i).reset();
      return;
    }
    const group = this.formArray.at(i) as FormGroup;

    group.patchValue({
      rate: $event.amount,
      amount: $event.amount
    });
    console.log("lab rate group", group.value);
  }

  ngOnInit() {
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
    this.formArray.valueChanges.subscribe(values => {
      this.labTotals = values.reduce(
        (sum: number, item: any) => sum + (Number(item.amount) || 0),
        0
      );
      this.totalsChanged.emit(this.labTotals);
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['patientLaboratoryTests'] &&
      this.patientLaboratoryTests?.length &&
      this.formArray
    ) {
      this.patientLaboratoryTests.forEach(laboratoryTest => {
        this.lab_rates.push(laboratoryTest.laboratory_test_rate); // Preload existing systems into options
        this.selectedLabRateOption = laboratoryTest.laboratory_test_rate_id;
        const labRateGroup = this.fb.group({
          id: [laboratoryTest.id || '', []],
          lab_rate: [laboratoryTest.laboratory_test_rate_id || null, Validators.required],
          rate: [laboratoryTest.amount || '', Validators.required],
          amount: [laboratoryTest.amount || '', Validators.required],
        });
        this.formArray.push(labRateGroup);
      });
    }
    //this.isLoading = false;
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}