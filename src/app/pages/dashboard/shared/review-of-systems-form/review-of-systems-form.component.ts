import { Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import { FormArray, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SystemsService } from '@services/dashboard/settings/systems/systems.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-review-of-systems-form',
  templateUrl: './review-of-systems-form.component.html',
  styleUrl: './review-of-systems-form.component.scss'
})
export class ReviewOfSystemsFormComponent implements OnInit, OnChanges {

  @Input({ required: true }) formArray!: FormArray;
  @Input() patientReviewOfSystems: any[] = [];

  isLoading: boolean = true;
  loading: boolean = false;
  loadingSystems: boolean = false;

  systems: any[] = [];

  searchSystems$ = new Subject<string>();

  selectedSystemOption: any;

  systemsGroup: FormGroup;

  constructor(private fb: FormBuilder, private toastr: ToastrService, private systemsService: SystemsService) {
/*
    this.systemsGroup = this.fb.group({
      system: [null, Validators.required],
      remarks: ['', Validators.required],
    });*/
    this.setupSearch();
  }

  setupSearch() {
    this.searchSystems$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSystems = true),  // Show the loading spinner
        switchMap(term => this.systemsService.getSystems(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.systems = results.systems.data;
        this.loadingSystems = false;  // Hide the loading spinner when the API call finishes
      });
  }

  newSystem(): FormGroup {
    const group = this.fb.group({
      id: ['', []],
      system: [null, [Validators.required]],
      remarks: ["", [Validators.required]],
    });

    this.formArray.markAllAsTouched();
    return group;
  }


  addSystem() {
    if (this.formArray.invalid) {
      this.toastr.error("Please fill all system details before adding a new one.");
      return;
    }
    this.formArray.push(this.newSystem());
  }

  removeSystem(index: number) {
    this.formArray.removeAt(index);
    //this.selectedPrescriptions.splice(index, 1);
    //this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  systemChange($event: any, i: number) {
    console.log("system id", $event.id);

    const exists = this.formArray.controls.some(
      (c, index) => index !== i && c.value.system === $event.id
    );
    if (exists) {
      this.toastr.error("System already added!");
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
      changes['patientReviewOfSystems'] &&
      this.patientReviewOfSystems?.length &&
      this.formArray
    ) {
      this.patientReviewOfSystems.forEach(system => {
        this.systems.push(system.system); // Preload existing systems into options
        this.selectedSystemOption = system.system_id;
        const systemGroup = this.fb.group({
          id: [system.id || '', []],
          system: [system.system_id|| null, Validators.required],
          remarks: [system.remarks || '', Validators.required],
        });
        this.formArray.push(systemGroup);
      });
    }
    //this.isLoading = false;
  }
  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}