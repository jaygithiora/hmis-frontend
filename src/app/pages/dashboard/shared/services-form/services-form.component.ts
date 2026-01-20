import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ServiceRatesService } from '@services/dashboard/services/service-rates/service-rates.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-services-form',
  templateUrl: './services-form.component.html',
  styleUrl: './services-form.component.scss'
})
export class ServicesFormComponent implements OnInit, OnChanges {

  @Input({ required: true }) formArray!: FormArray;
  @Output() totalsChanged = new EventEmitter<number>();
  @Input() patientServices: any[] = [];

  loadingServiceRates: boolean = false;

  service_rates: any[] = [];

  searchServiceRates$ = new Subject<string>();

  selectedServiceRateOption: any;

  serviceRateGroup: FormGroup;

  selectedServiceRates: any[] = [];
  serviceTotals: number = 0;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private serviceRatesService: ServiceRatesService,) {
    /*
    this.serviceRateGroup = this.fb.group({
      service_rate: [null, Validators.required],
      units: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]]
    });
*/
    this.setupSearch();
  }


  setupSearch() {
    this.searchServiceRates$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingServiceRates = true),  // Show the loading spinner
        switchMap(term => this.serviceRatesService.getServiceRates(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.service_rates = results.service_rates.data;
        this.loadingServiceRates = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newServiceRate(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      service_rate: [null, [Validators.required]],
      quantity: ['1', []],
      rate: ['', []],
      amount: ['', []],
    });

    group.get('quantity')!.valueChanges.subscribe(qty => {
      const rate = Number(group.get('rate')!.value) || 0;
      group.patchValue(
        { amount: (rate * (Number(qty) || 0)).toString() },
        { emitEvent: false }
      );

      this.calculateTotals();
    });
    this.formArray.markAllAsTouched();
    return group;
  }


  addServiceRate() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all service details before adding a new one.");
      return;
    }
    this.formArray.push(this.newServiceRate());
  }

  removeServiceRate(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  serviceRateChange($event: any, i: number) {
    console.log("service rate id", $event?.id);
    if (!$event) {
      this.formArray.at(i).reset();
      return;
    }

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.service_rate === $event.id
    );
    if (exists) {
      this.toastr.error("Service already added!");
      this.formArray.at(i).reset();
      return;
    }
    const group = this.formArray.at(i) as FormGroup;

    group.patchValue({
      rate: $event.amount,
      amount: $event.amount
    });
    this.calculateTotals();
    console.log("service rate group", group.value);
  }

  ngOnInit() {
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});
  this.formArray.valueChanges.subscribe(values => {
    this.serviceTotals = values.reduce(
      (sum: number, item: any) => sum + (Number(item.rate*item.quantity) || 0),
      0
    );
    this.totalsChanged.emit(this.serviceTotals);
  });*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['patientServices'] &&
      this.patientServices?.length &&
      this.formArray
    ) {
      this.patientServices.forEach(service => {
        this.service_rates.push(service.service_rate); // Preload existing systems into options
        this.selectedServiceRateOption = service.service_rate_id;
        const serviceRateGroup = this.fb.group({
          id: [service.id || '', []],
          service_rate: [service.service_rate_id || null, Validators.required],
          quantity: [service.quantity || '1', []],
          rate: [service.rate || '', Validators.required],
          amount: [service.amount || '', Validators.required],
        });
        this.formArray.push(serviceRateGroup);
        this.calculateTotals();
      });
    }
    //this.isLoading = false;
  }

  calculateTotals() {
    const values = this.formArray.value;

    this.serviceTotals = values.reduce(
      (sum: number, item: any) => sum + (Number(item.rate * item.quantity) || 0),
      0
    );

    this.totalsChanged.emit(this.serviceTotals);
  }


  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

