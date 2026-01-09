import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { ConsultationService } from '@services/dashboard/consultation/consultation.service';
import { LaboratoryTestRatesService } from '@services/dashboard/laboratory/laboratory-test-rates/laboratory-test-rates.service';
import { IcdsService } from '@services/dashboard/masters/icds/icds.service';
import { RadiologyItemRatesService } from '@services/dashboard/radiology/radiology-item-rates/radiology-item-rates.service';
import { ServiceRatesService } from '@services/dashboard/services/service-rates/service-rates.service';
import { MedicalHistoriesService } from '@services/dashboard/settings/medical-histories/medical-histories.service';
import { NextOfKinRelationsService } from '@services/dashboard/settings/next-of-kin-relations/next-of-kin-relations.service';
import { SocialHistoriesService } from '@services/dashboard/settings/social-histories/social-histories.service';
import { SurgerySettingsService } from '@services/dashboard/settings/surgery-settings/surgery-settings.service';
import { SystemsService } from '@services/dashboard/settings/systems/systems.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-consultation-form',
  templateUrl: './consultation-form.component.html',
  styleUrl: './consultation-form.component.scss'
})
export class ConsultationFormComponent implements OnInit {
  disabled = false;
  isLoading: boolean = true;
  loading: boolean = false;
  loadingSystems: boolean = false;
  loadingMedicalHistories: boolean = false;
  loadingSurgeries: boolean = false;
  loadingSocialHistories: boolean = false;
  loadingFamilyMedicalHistories: boolean = false;
  loadingDiagnosis: boolean = false;
  loadingLabRates: boolean = false;
  loadingRadRates: boolean = false;
  loadingServiceRates: boolean = false;

  consultation: any;
  systems: any[] = [];
  medical_histories: any[] = [];
  surgeries: any[] = [];
  social_histories: any[] = [];
  family_medical_histories: any[] = [];
  diagnosis: any[] = [];
  lab_rates: any[] = [];
  rad_rates: any[] = [];
  service_rates: any[] = [];

  searchSystems$ = new Subject<string>();
  searchMedicalHistories$ = new Subject<string>();
  searchSurgeries$ = new Subject<string>();
  searchSocialHistories$ = new Subject<string>();
  searchFamilyMedicalHistories$ = new Subject<string>();
  searchDiagnosis$ = new Subject<string>();
  searchLabRates$ = new Subject<string>();
  searchRadRates$ = new Subject<string>();
  searchServiceRates$ = new Subject<string>();

  selectedSystemOption: any;
  selectedMedicalHistoryOption: any;
  selectedSurgeryOption: any;
  selectedSocialHistoryOption: any;
  selectedFamilyMedicalHistoryOption: any;
  selectedDiagnosisOption: any;
  selectedLabRateOption: any;
  selectedRadRateOption: any;
  selectedServiceRateOption: any;

  consultationForm!: FormGroup;
  newAllergyGroup: FormGroup;
  systemsGroup: FormGroup;
  medicalHistoryGroup: FormGroup;
  surgeryGroup: FormGroup;
  socialHistoryGroup: FormGroup;
  familyMedicalHistoryGroup: FormGroup;
  diagnosisGroup: FormGroup;
  labRateGroup: FormGroup;
  radRateGroup: FormGroup;
  serviceRateGroup: FormGroup;

  selectedSystems: any[] = [];
  selectedMedicalHistories: any[] = [];
  selectedSurgeries: any[] = [];
  selectedSocialHistories: any[] = [];
  selectedFamilyMedicalHistories: any[] = [];
  selectedDiagnosis: any[] = [];
  selectedLabRates: any[] = [];
  selectedRadRates: any[] = [];
  selectedServiceRates: any[] = [];

  active = 1;
  activeIds: string = "custom-panel-patient,custom-panel-triage,custom-panel-consultation";
  age: any;

  allergies = [{ id: "Drug Allergy", name: "Drug Allergy" }, { id: "Food Allergy", name: "Food Allergy" }, { id: "Other Allergies", name: "Other Allergies" }];
  durations = [{ id: "Year(s)", name: "Year(s)" }, { id: "Month(s)", name: "Month(s)" }, { id: "Day(s)", name: "Day(s)" }];
  severity = [{ id: "Severe", name: "Severe" }, { id: "Mild", name: "Mild" }];
  statuses = [{ id: 1, name: "Active" }, { id: 0, name: "Inactive" }];

  diagnosis_types = [{ id: "Primary", name: "Primary" }, { id: "Secondary", name: "Secondary" }];
  diagnosis_levels = [{ id: "Provisional", name: "Provisional" }, { id: "Final", name: "Final" }];

  labTotals: number = 0;
  radTotals: number = 0;
  serviceTotals: number = 0;

  constructor(private consultationService: ConsultationService, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router, private activatedRoute: ActivatedRoute, private systemsService: SystemsService, private medicalHistoryService: MedicalHistoriesService,
    private surgerySettingsService: SurgerySettingsService, private socialHistoriesService: SocialHistoriesService, private nextOfKinService: NextOfKinRelationsService,
    private icdService: IcdsService, private laboratoryTestRatesService: LaboratoryTestRatesService, private radiologyTestRatesService: RadiologyItemRatesService,
    private serviceRatesService: ServiceRatesService) {
    this.consultationForm = this.fb.group({
      id: ['0', [Validators.required]],
      consultation_id: ['', [Validators.required]],
      form_allergies: this.fb.array([]),
      form_systems: this.fb.array([]),
      medical_histories: this.fb.array([]),
      chief_complaints: ['', [Validators.required]],
      history_complaints: [''],
      surgeries: this.fb.array([]),
      social_histories: this.fb.array([]),
      family_medical_histories: this.fb.array([]),
      diagnosis: this.fb.array([]),
      lab_rates: this.fb.array([]),
      rad_rates: this.fb.array([]),
      service_rates: this.fb.array([])
    });

    this.newAllergyGroup = this.fb.group({
      allergyType: [null, Validators.required],
      allergy: ['', Validators.required],
      sinceWhen: ['', Validators.required],
      duration: [null, Validators.required],
      severity: [null, Validators.required],
      status: [null, Validators.required],
    });

    this.systemsGroup = this.fb.group({
      system: [null, Validators.required],
      remarks: ['', Validators.required],
    });

    this.medicalHistoryGroup = this.fb.group({
      medical_history: [null, Validators.required],
      remarks: ['', Validators.required],
    });

    this.surgeryGroup = this.fb.group({
      surgery: [null, Validators.required],
      date: ['', Validators.required],
      remarks: ['', Validators.required],
    });

    this.socialHistoryGroup = this.fb.group({
      social_history: [null, Validators.required],
    });

    this.familyMedicalHistoryGroup = this.fb.group({
      family_medical_history: [null, Validators.required],
      description: ['', Validators.required]
    });

    this.diagnosisGroup = this.fb.group({
      diagnosis: [null, Validators.required],
      diagnosis_type: ['Primary', Validators.required],
      diagnosis_level: ['Provisional', Validators.required]
    });

    this.labRateGroup = this.fb.group({
      lab_rate: [null, Validators.required]
    });

    this.radRateGroup = this.fb.group({
      rad_rate: [null, Validators.required]
    });

    this.serviceRateGroup = this.fb.group({
      service_rate: [null, Validators.required],
      units: [1, [Validators.required]]
    });

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
    this.searchMedicalHistories$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingMedicalHistories = true),  // Show the loading spinner
        switchMap(term => this.medicalHistoryService.getMedicalHistories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.medical_histories = results.medical_histories.data;
        this.loadingMedicalHistories = false;  // Hide the loading spinner when the API call finishes
      });
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
    this.searchSocialHistories$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSocialHistories = true),  // Show the loading spinner
        switchMap(term => this.socialHistoriesService.getSocialHistories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.social_histories = results.social_histories.data;
        this.loadingSocialHistories = false;  // Hide the loading spinner when the API call finishes
      });
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
    this.searchDiagnosis$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDiagnosis = true),  // Show the loading spinner
        switchMap(term => this.icdService.getICDs(1))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.diagnosis = results.icds.data;
        this.loadingDiagnosis = false;  // Hide the loading spinner when the API call finishes
      });
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
    this.searchServiceRates$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingServiceRates = true),  // Show the loading spinner
        switchMap(term => this.serviceRatesService.getServiceRates(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.service_rates = results.service_item_rates.data;
        this.loadingServiceRates = false;  // Hide the loading spinner when the API call finishes
      });
  }

  get formAllergies(): FormArray {
    return this.consultationForm.get('form_allergies') as FormArray;
  }

  addFormAllergy() {
    if (this.formAllergies.controls.some(
      control => control.get('allergyType')?.value?.toLowerCase().trim() === this.newAllergyGroup.get("allergyType").value.toLowerCase().trim()
    )) {
      this.toastr.error("Allergy already exists!");
    } else {
      if (this.newAllergyGroup.valid) {
        this.formAllergies.push(this.fb.group(this.newAllergyGroup.value));
        this.newAllergyGroup.reset(); // Clear input fields
      }
    }
  }

  removeAllergy(index: number) {
    this.formAllergies.removeAt(index);
  }

  get formSystems(): FormArray {
    return this.consultationForm.get('form_systems') as FormArray;
  }

  addSystem() {
    if (this.selectedSystems.find(m => m.id == this.selectedSystemOption) != null) {
      this.toastr.error("System already added!");
    } else {
      if (this.systemsGroup.valid) {
        this.formSystems.push(this.fb.group(this.systemsGroup.value));
        this.selectedSystems.push(this.systems.find(m => m.id == this.selectedSystemOption));
        this.systemsGroup.reset(); // Clear input fields
        //console.log(this.selectedSystems);
      }
    }
  }

  removeSystem(index: number) {
    this.formSystems.removeAt(index);
    this.selectedSystems.splice(index, 1);
  }

  get formMedicalHistory(): FormArray {
    return this.consultationForm.get('medical_histories') as FormArray;
  }

  addMedicalHistory() {

    if (this.selectedMedicalHistories.find(m => m.id == this.selectedMedicalHistoryOption) != null) {
      this.toastr.error("Medical History already added!");
    } else {
      if (this.medicalHistoryGroup.valid) {
        this.formMedicalHistory.push(this.fb.group(this.medicalHistoryGroup.value));
        this.selectedMedicalHistories.push(this.medical_histories.find(m => m.id == this.selectedMedicalHistoryOption));
        this.medicalHistoryGroup.reset(); // Clear input fields
        //console.log(this.selectedSystems);
      }
    }
  }

  removeMedicalHistory(index: number) {
    this.formMedicalHistory.removeAt(index);
    this.selectedMedicalHistories.splice(index, 1);
  }

  get formSurgery(): FormArray {
    return this.consultationForm.get('surgeries') as FormArray;
  }

  addSurgery() {
    if (this.selectedSurgeries.find(m => m.id == this.selectedSurgeryOption) != null) {
      this.toastr.error("Surgery History already added!");
    } else {
      if (this.surgeryGroup.valid) {
        this.formSurgery.push(this.fb.group(this.surgeryGroup.value));
        this.surgeryGroup.reset();
      }
    }
  }

  removeSurgery(index: number) {
    this.formSurgery.removeAt(index);
    this.selectedSurgeries.splice(index, 1);
  }

  get formSocialHistory(): FormArray {
    return this.consultationForm.get('social_histories') as FormArray;
  }

  addSocialHistory() {
    if (this.selectedSocialHistories.find(m => m.id == this.selectedSocialHistoryOption) != null) {
      this.toastr.error("Social History already added!");
    } else {
      if (this.socialHistoryGroup.valid) {
        this.formSocialHistory.push(this.fb.group(this.socialHistoryGroup.value));
        this.selectedSocialHistories.push(this.social_histories.find(s => s.id == this.selectedSocialHistoryOption));
        this.socialHistoryGroup.reset();
      }
    }
  }

  removeSocialHistory(index: number) {
    this.formSocialHistory.removeAt(index);
    this.selectedSocialHistories.splice(index, 1);
  }

  get formFamilyMedicalHistory(): FormArray {
    return this.consultationForm.get('family_medical_histories') as FormArray;
  }

  addFamilyMedicalHistory() {
    if (this.selectedFamilyMedicalHistories.find(m => m.id == this.selectedFamilyMedicalHistoryOption) != null) {
      this.toastr.error("Family already added!");
    } else {
      if (this.familyMedicalHistoryGroup.valid) {
        this.formFamilyMedicalHistory.push(this.fb.group(this.familyMedicalHistoryGroup.value));
        this.selectedFamilyMedicalHistories.push(this.family_medical_histories.find(m => m.id == this.selectedFamilyMedicalHistoryOption))
        this.familyMedicalHistoryGroup.reset();
      }
    }
  }

  removeFamilyMedicalHistory(index: number) {
    this.formFamilyMedicalHistory.removeAt(index);
    this.selectedFamilyMedicalHistories.splice(index, 1);
  }

  get formDiagnosis(): FormArray {
    return this.consultationForm.get('diagnosis') as FormArray;
  }

  addDiagnosis() {
    if (this.selectedDiagnosis.find(m => m.id == this.selectedDiagnosisOption) != null) {
      this.toastr.error("Diagnosis already added!");
    } else {
      if (this.diagnosisGroup.valid) {
        this.formDiagnosis.push(this.fb.group(this.diagnosisGroup.value));
        this.selectedDiagnosis.push(this.diagnosis.find(diag => diag.id == this.selectedDiagnosisOption))
        this.diagnosisGroup.reset();
      }
    }
  }

  removeDiagnosis(index: number) {
    this.formDiagnosis.removeAt(index);
    this.selectedDiagnosis.splice(index, 1);
  }

  get formLabRate(): FormArray {
    return this.consultationForm.get('lab_rates') as FormArray;
  }

  addLabRate() {
    if (this.selectedLabRates.find(m => m.id == this.selectedLabRateOption) != null) {
      this.toastr.error("Laboratory Rate already added!");
    } else {
      if (this.labRateGroup.valid) {
        this.formLabRate.push(this.fb.group(this.labRateGroup.value));
        this.selectedLabRates.push(this.lab_rates.find(lab_rate => lab_rate.id == this.selectedLabRateOption));
        this.labTotals = this.getRateTotals(this.selectedLabRates);
        this.labRateGroup.reset();
      }
    }
  }

  removeLabRate(index: number) {
    this.formLabRate.removeAt(index);
    this.selectedLabRates.splice(index, 1);
    this.labTotals = this.getRateTotals(this.selectedLabRates);
  }

  get formRadRate(): FormArray {
    return this.consultationForm.get('rad_rates') as FormArray;
  }

  addRadRate() {
    if (this.selectedRadRates.find(m => m.id == this.selectedRadRateOption) != null) {
      this.toastr.error("Radiology Rate already added!");
    } else {
      if (this.radRateGroup.valid) {
        this.formRadRate.push(this.fb.group(this.radRateGroup.value));
        this.selectedRadRates.push(this.rad_rates.find(rad_rate => rad_rate.id == this.selectedRadRateOption));
        this.radTotals = this.getRateTotals(this.selectedRadRates);
        this.radRateGroup.reset();
      }
    }
  }

  removeRadRate(index: number) {
    this.formRadRate.removeAt(index);
    this.selectedRadRates.splice(index, 1);
    this.radTotals = this.getRateTotals(this.selectedRadRates);
  }
  get formServiceRate(): FormArray {
    return this.consultationForm.get('service_rates') as FormArray;
  }

  addServiceRate() {
    if (this.selectedServiceRates.find(m => m.id == this.selectedServiceRateOption) != null) {
      this.toastr.error("Service Rate already added!");
    } else {
      if (this.serviceRateGroup.valid) {
        this.formServiceRate.push(this.fb.group(this.serviceRateGroup.value));
        this.selectedServiceRates.push(this.service_rates.find(service_rate => service_rate.id == this.selectedServiceRateOption));
        this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
        this.serviceRateGroup.reset();
      }
    }
  }

  removeServiceRate(index: number) {
    this.formServiceRate.removeAt(index);
    this.selectedServiceRates.splice(index, 1);
    this.serviceTotals = this.getRateTotals(this.selectedServiceRates);
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.consultationForm.get("consultation_id").setValue(id);
      this.isLoading = true;
      this.consultationService.getConsultation(parseInt(id)).subscribe((result: any) => {
        console.log("VISIT:",result);
        this.consultation = result.outpatient_consultation;
        this.age = this.getAgeDetails(this.consultation?.outpatient_visit?.patient?.dob);
        this.isLoading = false;
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.router.navigate(["dashboard/consultation/list"]);
    }
  }

  getAgeDetails(dob: string) {
    const birthDate = moment(dob);
    const today = moment();

    const years = today.diff(birthDate, 'years');
    birthDate.add(years, 'years');

    const months = today.diff(birthDate, 'months');
    birthDate.add(months, 'months');

    const days = today.diff(birthDate, 'days');

    return { years, months, days };
  }

  showStatus(id: any): string {
    return this.statuses.find(status => status.id == id)?.name;
  }
  showRate(rates:any[], id: any): string {
    return rates.find(l => l.id == id)?.amount ?? 0.00;
  }

  getRateTotals(rates:any[]): number {
    return rates.reduce((sum, group) => {
      const amount = group.amount;
      return sum + (parseFloat(amount) || 0);
    }, 0);
  }

  addConsultation() {
    /*if (this.consultationForm.valid) {
      this.isLoading = true;
      this.consultationService.updateTriage(this.triageForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["dashboard/triage/list"])
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.triage_id) {
          this.toastr.error(error?.error?.errors?.triage_id);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        if (error.error.errors) {
          this.handleValidationErrors(error.error.errors);
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }*/
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}



