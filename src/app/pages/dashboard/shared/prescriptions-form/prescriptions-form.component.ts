//import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { DrugFrequenciesService } from '@services/dashboard/inventory/drug_frequencies/drug-frequencies.service';
import { ProductStocksService } from '@services/dashboard/stocks/product-stocks/product-stocks.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-prescriptions-form',
  templateUrl: './prescriptions-form.component.html',
  //standalone: true,
  //imports: [CommonModule, ReactiveFormsModule, NgSelectModule],
  styleUrl: './prescriptions-form.component.scss'
})
export class PrescriptionsFormComponent implements OnInit, OnChanges {

  @Input({ required: true }) formArray!: FormArray;
  @Output() totalsChanged = new EventEmitter<number>();
  @Input() patientPrescriptions: any[] = [];

  isLoading: boolean = true;
  loading: boolean = false;
  loadingPrescriptions: boolean = false;
  loadingFrequencies: boolean = false;

  prescriptions: any[] = [];
  frequencies: any[] = [];

  searchPrescriptions$ = new Subject<string>();
  searchFrequencies$ = new Subject<string>();

  selectedPrescriptionOption: any;
  selectedFrequencyOption: any;

  prescriptionGroup: FormGroup;

  selectedPrescriptions: any[] = [];
  selectedFrequencies: any[] = [];
  prescriptionTotals: number = 0;

  private updating = false;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private productStockService: ProductStocksService,
    private drugFrequenciesService: DrugFrequenciesService,) {
    /*
  
  this.prescriptionGroup = this.fb.group({
    prescription: [null, Validators.required],
    quantity: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
    days: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
    dose: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]],
    stock: [''],
    strength: [''],
    dose_measure: [''],
    route: [''],
    frequency: [null, Validators.required],
    freq: [''],
    rate: ['', Validators.required],
    amount: ['', Validators.required],
  });
*/
    this.setupSearch();
  }

  setupSearch() {
    this.searchPrescriptions$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingPrescriptions = true),  // Show the loading spinner
        switchMap(term => this.productStockService.getStocks(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.prescriptions = results.stocks.data.map(p => ({
          ...p,
          display: `${p.product.name} - ${p.product.code}`
        }));
        this.loadingPrescriptions = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchFrequencies$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingFrequencies = true),  // Show the loading spinner
        switchMap(term => this.drugFrequenciesService.getDrugFrequencies(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.frequencies = results.drug_frequencies.data;
        this.loadingFrequencies = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newPrescription(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      prescription: [null, [Validators.required]],
      frequency: [null, [Validators.required]],
      freq: ['', []],
      quantity: [1, [Validators.required]],
      days: [1, [Validators.required]],
      dose: [1, [Validators.required]],
      stock: ['', []],
      strength: ['', []],
      dose_measure: ['', []],
      route: ['', []],
      rate: ['', []],
      amount: ['', []],
    });

    group.get('dose')?.valueChanges.subscribe(() => {
      this.onDaysChange(group);
    });

    group.get('days')?.valueChanges.subscribe(() => {
      this.onDaysChange(group);
    });

    group.get('quantity')?.valueChanges.subscribe(() => {
      this.onQuantityChange(group);
    });
    group.get('freq')?.valueChanges.subscribe(() => {
      this.onQuantityChange(group);
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addPrescription() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all prescription details before adding a new one.");
      return;
    }
    this.formArray.push(this.newPrescription());
  }

  removePrescription(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  prescriptionChange($event: any, i: number) {
    console.log("prescription id", $event.id);

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.prescription === $event.id
    );
    if (exists) {
      this.toastr.error("Prescription already added!");
      this.formArray.at(i).reset();
      return;
    }
    const group = this.formArray.at(i) as FormGroup;

    group.patchValue({
      stock: $event.quantity,
      strength: `${$event.strength} ${$event.inventory_strength_unit.name}`,
      dose_measure: $event.product.dose_measure.name,
      route: $event.product.drug_instruction.name,
      rate: $event.selling,
      amount: $event.selling
    });
  }
  frequencyChange($event: any, i: number) {
    console.log($event);
    const group = this.formArray.at(i) as FormGroup;
    group.patchValue({ freq: $event?.frequency });
    this.onDaysChange(group);
  }

  onDaysChange(group: FormGroup) {
    //const group = this.formPrescriptions.at(i) as FormGroup;
    //const quantity = group.get('quantity')?.value || 1;
    if (this.updating) return;
    this.updating = true;
    const dose = group.get('dose')?.value || 1;
    const days = group.get('days')?.value || 1;

    const amount = /*quantity * */dose * days * (group.get('rate')?.value || 0) * (group.get('freq')?.value || 0);
    group.patchValue({ amount: amount, quantity: dose * days * (group.get('freq')?.value || 0) });
    this.calculatePrescriptionAmount();
    this.updating = false;
  }

  onQuantityChange(group: FormGroup) {
    //const group = this.formPrescriptions.at(i) as FormGroup;
    if (this.updating) return;
    this.updating = true;
    const quantity = group.get('quantity')?.value || 1;
    const dose = group.get('dose')?.value || 1;
    //const days = group.get('days')?.value || 1;

    const amount = quantity * /*dose * days */ (group.get('rate')?.value || 0)/*(group.get('freq')?.value || 0)*/;
    group.patchValue({ amount: amount, days: quantity / (dose * (group.get('freq')?.value || 0)) });
    this.calculatePrescriptionAmount();
    this.updating = false;
  }

  calculatePrescriptionAmount() {
    this.formArray.valueChanges.subscribe(values => {
      this.prescriptionTotals = values.reduce(
        (sum: number, item: any) => sum + (+item.amount || 0),
        0
      );
    });
    this.totalsChanged.emit(this.prescriptionTotals);
  }

  ngOnInit() {
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (
      changes['patientPrescriptions'] &&
      this.patientPrescriptions?.length &&
      this.formArray
    ) {
      this.patientPrescriptions.forEach(prescription => {
        this.prescriptions.push({
          ...prescription.product_rate,
          display: `${prescription.product_rate.product.name} - ${prescription.product_rate.product.code}`
        }); 
        this.frequencies.push(prescription.drug_frequency);
        // Preload existing systems into options
        this.selectedPrescriptionOption = prescription.product_rate_id;
        const prescriptionGroup = this.fb.group({
          id: [prescription.id || '', []],
          prescription: [prescription.product_rate_id || null, Validators.required],
          dose: [prescription.dose || '', Validators.required],
          frequency:[prescription.drug_frequency_id || null, Validators.required],
          freq: [prescription.drug_frequency.frequency || '', []],
          quantity: [prescription.quantity || '', Validators.required],
          days: [prescription.days || '', Validators.required],
          stock: [prescription.stock || '', []],
          strength: [prescription.strength || '', []],
          dose_measure: [prescription.dose_measure || '', []],
          route: [prescription.route || '', []],
          rate: [prescription.rate || '', Validators.required],
          amount: [prescription.amount || '', Validators.required],
        });
        this.prescriptionTotals += prescription.amount || 0;
        this.formArray.push(prescriptionGroup);
        this.calculatePrescriptionAmount();
      });
    }
    //this.isLoading = false;
  }
  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}




