import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SickLeaveTypesService } from '@services/dashboard/settings/sick-leave-types/sick-leave-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-sick-leave-form',
  templateUrl: './sick-leave-form.component.html',
  styleUrl: './sick-leave-form.component.scss'
})
export class SickLeaveFormComponent implements OnInit {

  @Input({ required: true }) formArray!: FormArray;

  loadingTypes: boolean = false;

  sick_leave_types: any[] = [];

  searchSickLeaveTypes$ = new Subject<string>();

  selectedSickLeaveTypeOption: any;

  sickLeaveTypeGroup: FormGroup;

  work_related = [{ id: 1, name: "YES" }, { id: 0, name: "NO" }];

  constructor(private fb: FormBuilder, private toastr: ToastrService, private sickLeaveTypesService: SickLeaveTypesService,) {
    /*
    this.serviceRateGroup = this.fb.group({
      service_rate: [null, Validators.required],
      units: [1, [Validators.required, Validators.min(1), Validators.pattern(/^[1-9]\d*$/)]]
    });
*/
    this.setupSearch();
  }


  setupSearch() {
    this.searchSickLeaveTypes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingTypes = true),  // Show the loading spinner
        switchMap(term => this.sickLeaveTypesService.getSickLeaveTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.sick_leave_types = results.sick_leave_types.data;
        this.loadingTypes = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newSickLeave(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      from_date: ["", [Validators.required]],
      to_date: ["", [Validators.required]],
      days: ["", [Validators.required]],
      work_related: [1, [Validators.required]],
      sick_leave_type: [null, [Validators.required]],
      review_date: ['', []],
      light_duty_from_date: ['', []],
      light_duty_to_date: ['', []],
      light_duty_days: ['', []],
      remarks: ['', []],
    });
    this.formArray.markAllAsTouched();
    return group;
  }


  addServiceRate() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all service details before adding a new one.");
      return;
    }
    this.formArray.push(this.newSickLeave());
  }

  removeServiceRate(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  serviceRateChange($event: any, i: number) {
    console.log("service rate id", $event?.id);
    if(!$event) {
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


  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

