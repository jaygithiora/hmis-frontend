import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { AccountsService } from '@services/dashboard/masters/accounts/accounts.service';
import { BloodGroupsService } from '@services/dashboard/masters/blood-groups/blood-groups.service';
import { HospitalDataService } from '@services/dashboard/masters/hospital-data.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import { MainTypesService } from '@services/dashboard/masters/manin-types/main-types.service';
import { PlansService } from '@services/dashboard/masters/plans/plans.service';
import { SalutationService } from '@services/dashboard/masters/salutation/salutation.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-patient-registration',
  templateUrl: './patient-registration.component.html',
  styleUrl: './patient-registration.component.scss'
})
export class PatientRegistrationComponent implements OnInit, AfterViewInit{
  @ViewChild('locationInput') locationInput!: ElementRef;

  public isLoading:boolean = false;
    loading: boolean = false;
    loadingMainType:boolean = false;
    loadingSubType:boolean = false;
    loadingAccount:boolean = false;
    loadingPlan:boolean = false;
    loadingSalutation:boolean = false;
    loadingBloodGroup:boolean = false;

    locations: any[] = [];
    main_types: any[] = [];
    sub_types: any[] = [];
    accounts: any[] = [];
    plans: any[] = [];
    salutations: any[] = [];
    blood_groups: any[] = [];

    search$ = new Subject<string>();
    searchMainTypes$ = new Subject<string>();
    searchSubTypes$ = new Subject<string>();
    searchAccounts$ = new Subject<string>();
    searchPlan$ = new Subject<string>();
    searchSalutation$ = new Subject<string>();
    searchBloodGroup$ = new Subject<string>();

    selectedOption: any;
    selectedMainTypeOption: any;
    selectedSubTypeOption: any;
    selectedAccountOption: any;
    selectedPlanOption: any;
    selectedSalutationOption: any;
    selectedBloodGroupOption: any;

  patient : any;
  patientRegistrationForm!:FormGroup;

  constructor(private hospitalDataService: HospitalDataService, private toastr:ToastrService, private service:AuthService,
    private fb:FormBuilder, private locationService:LocationsService, private mainTypeService:MainTypesService,
    private accountService:AccountsService, private subTypeService: SubTypesService, private planService:PlansService,
  private salutationService:SalutationService, private bloodGroupService:BloodGroupsService){
    this.patientRegistrationForm = this.fb.group({
      id:['0', [Validators.required]],
      location:['', [Validators.required]],
      main_type:['', [Validators.required]],
      sub_type:['', [Validators.required]],
      account:['', [Validators.required]],
      plan: ['', [Validators.required]],
      validity: [''],
      bill_type: [''],
      copay: [''],
      limit: [''],
      salutation: ['', [Validators.required]],
      gender: ['', [Validators.required]],
      first_name: ['', [Validators.required]],
      other_names: ['', [Validators.required]],
      id_number: [''],
      member_number: [''],
      member_type: ['', [Validators.required]],
      blood_group: [''],
      guardian_name: [''],
      patient_location: ['', [Validators.required]],
      phone:['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      email:['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]]
    });

    this.setupSearch();
  }

  setupSearch() {
      this.search$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loading = true),  // Show the loading spinner
          switchMap(term => this.locationService.getLocations(1, term))  // Switch to a new observable for each search term
        )
        .subscribe((results: any) => {
          this.locations = results.locations.data;
          this.loading = false;  // Hide the loading spinner when the API call finishes
        });
        this.searchMainTypes$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loadingMainType = true),  // Show the loading spinner
          switchMap(term => this.mainTypeService.getMainTypes(1, term))  // Switch to a new observable for each search term
        )
        .subscribe((results: any) => {
          this.selectedSubTypeOption = null;
          this.main_types = results.main_types.data;
          this.loadingMainType = false;  // Hide the loading spinner when the API call finishes
        });
        this.searchSubTypes$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loadingSubType = true),  // Show the loading spinner
          switchMap(term => this.subTypeService.getSubTypes(1, term,this.selectedMainTypeOption))  // Switch to a new observable for each search term
        )
        .subscribe((results: any) => {
          this.selectedAccountOption = null;
          this.sub_types = results.sub_types.data;
          this.loadingSubType = false;  // Hide the loading spinner when the API call finishes
        });
        this.searchAccounts$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loadingAccount = true),  // Show the loading spinner
          switchMap(term => this.accountService.getAccounts(1, term,this.selectedSubTypeOption))  // Switch to a new observable for each search term
        )
        .subscribe((results: any) => {
          this.accounts = results.accounts.data;
          this.loadingAccount = false;  // Hide the loading spinner when the API call finishes
        });
        this.searchPlan$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loadingPlan = true),  // Show the loading spinner
          switchMap(term => this.planService.getPlans(1, term,this.selectedSubTypeOption))  // Switch to a new observable for each search term
        )
        .subscribe((results: any) => {
          this.plans = results.plans.data;
          this.loadingPlan = false;  // Hide the loading spinner when the API call finishes
        });
        this.searchSalutation$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loadingSalutation = true),  // Show the loading spinner
          switchMap(term => this.salutationService.getSalutations(1, term))  // Switch to a new observable for each search term
        )
        .subscribe((results: any) => {
          this.salutations = results.salutations.data;
          this.loadingSalutation = false;  // Hide the loading spinner when the API call finishes
        });
        this.searchBloodGroup$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loadingBloodGroup = true),  // Show the loading spinner
          switchMap(term => this.bloodGroupService.getBloodGroups(1, term))  // Switch to a new observable for each search term
        )
        .subscribe((results: any) => {
          this.blood_groups = results.blood_groups.data;
          this.loadingBloodGroup = false;  // Hide the loading spinner when the API call finishes
        });
    }
    // Handle item selection
    onItemSelect(event: any) {
      console.log('Selected item:', event);
    }

  ngOnInit(){
    this.isLoading = true;
    this.hospitalDataService.getHospitalData().subscribe((result:any)=>{
      this.patient = result?.patient;
      if(this.patient != null){
        this.patientRegistrationForm.get("id").setValue(this.patient.id);
        this.patientRegistrationForm.get("hospital_name").setValue(this.patient.name);
        this.patientRegistrationForm.get("location").setValue(this.patient.location);
        this.patientRegistrationForm.get("phone").setValue(this.patient.phone);
        this.patientRegistrationForm.get("email").setValue(this.patient.email);
        this.patientRegistrationForm.get("address").setValue(this.patient.address);
      }
      this.isLoading = false;
    }, error=>{
      if (error?.error?.message) {
        this.toastr.error(error?.error?.message);
        this.service.logout();
      }
      this.isLoading = false;
      console.log(error);
    });
  }
  ngAfterViewInit() {
    const autocomplete = new google.maps.places.Autocomplete(this.locationInput.nativeElement, {
      types: ['geocode'], // or use ['(cities)'] or ['establishment']
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      console.log('Selected Place:', place);
      // You can extract place.geometry.location, place.formatted_address, etc.
    });
  }

  updateHospitalData(){
    if(this.patientRegistrationForm.valid){
      this.isLoading = true;
    this.hospitalDataService.updateHospitalData(this.patientRegistrationForm.getRawValue()).subscribe((result:any)=>{
      if(result.success){
        this.toastr.success(result.success);
      }
      this.isLoading = false;
    }, error=>{
      if (error?.error?.message) {
        this.toastr.error(error?.error?.message);
        this.service.logout();
      }
      if (error?.error?.message) {
        this.toastr.error(error?.error?.message);
        this.service.logout();
      }
      this.isLoading = false;
      console.log(error);
    });
    }else{
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
}

