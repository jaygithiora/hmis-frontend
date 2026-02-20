import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@services/auth/auth.service';
import { OutpatientVisitsService } from '@services/dashboard/outpatient-visits/outpatient-visits.service';
import { PatientRegistrationService } from '@services/dashboard/patients/patient-registration/patient-registration.service';
import { ToastrService } from 'ngx-toastr';
import { WebcamImage } from 'ngx-webcam';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { SchemeDepartmentsService } from '@services/dashboard/masters/insurances/scheme-departments/scheme-departments.service';
import { SpecializationsService } from '@services/dashboard/settings/specializations/specializations.service';
import { DoctorFeesService } from '@services/dashboard/masters/doctors/doctor-fees/doctor-fees.service';
import { FeeTypesService } from '@services/dashboard/settings/fee-types/fee-types.service';

@Component({
  selector: 'app-create-op-visit',
  templateUrl: './create-op-visit.component.html',
  styleUrl: './create-op-visit.component.scss'
})
export class CreateOpVisitComponent implements OnInit {
  @ViewChild('locationInput') locationInput!: ElementRef;
  patientImage: WebcamImage;

  public isLoading: boolean = false;
  loading: boolean = false;
  loadingSchemes: boolean = false;
  loadingFeeTypes: boolean = false;
  loadingPatients: boolean = false;
  loadingDepartments: boolean = false;
  loadingSpecialities: boolean = false;
  loadingDoctorFees: boolean = false;

  schemes: any[] = [];
  fee_types: any[] = [];
  patients: any[] = [];
  departments: any[] = [];
  specialities: any[] = [];
  doctor_fees: any[] = [];

  searchSchemes$ = new Subject<string>();
  searchFeeType$ = new Subject<string>();
  searchPatient$ = new Subject<string>();
  searchDepartment$ = new Subject<string>();
  searchSpeciality$ = new Subject<string>();
  searchDoctorFee$ = new Subject<string>();

  selectedSchemeOption: any;
  selectedFeeTypeOption: any;
  selectedPatientOption: any;
  selectedDepartmentOption: any;
  selectedSpecialityOption: any;
  selectedDoctorFeeOption: any;

  patient: any;
  outpatient_visit: any;
  visitForm!: FormGroup;

  imageUrl = 'assets/img/default-profile.png';
  patientId: number = 0;
  visitId: number = 0;

  constructor(private patientRegistrationService: PatientRegistrationService, private outpatientVisitsService: OutpatientVisitsService, private toastr: ToastrService, private service: AuthService,
    private fb: FormBuilder, private activatedRoute: ActivatedRoute, private feeTypeService: FeeTypesService,
    private schemeDepartmentsService: SchemeDepartmentsService, private specialitiesService: SpecializationsService,
    private doctorFeesService: DoctorFeesService,
    private router: Router) {
    this.visitForm = this.fb.group({
      id: ['0', [Validators.required]],
      patient: ['0'],
      organization: ['', [Validators.required]],
      branch: [''],
      doctor: ['', [Validators.required]],
      scheme: [null, [Validators.required]],
      department: [null, [Validators.required]],
      fee_type: [null, [Validators.required]],
      speciality: [null, [Validators.required]],
      doctor_fee: [null, [Validators.required]],
      consultation_fees: ['0', [Validators.required]],
      status: ['active', Validators.required]
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchPatient$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingPatients = true),  // Show the loading spinner
        switchMap(term => this.patientRegistrationService.getPatientRegistrations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.patients = results.patients.data.map((patient: any) => ({ ...patient, name: `CODE: ${patient.code} | NAME: ${patient.first_name} ${patient.other_names} | ID: ${patient.id_number} | PHONE: ${patient.phone}` }));
        this.loadingPatients = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchDepartment$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDepartments = true),  // Show the loading spinner
        switchMap(term => this.schemeDepartmentsService.getSchemeDepartments(1, term,this.selectedSchemeOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.selectedSpecialityOption = null;
        this.departments = results.scheme_departments.data
        this.loadingDepartments = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSpeciality$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSpecialities = true),  // Show the loading spinner
        switchMap(term => this.specialitiesService.getSpecializations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        //console.log("specialities:", results);
        this.selectedDoctorFeeOption = null;
        this.specialities = results.specializations.data;
        this.loadingSpecialities = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchFeeType$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingFeeTypes = true),  // Show the loading spinner
        switchMap(term => this.feeTypeService.getFeeTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        //console.log("specialities:", results);
        this.selectedDoctorFeeOption = null;
        this.fee_types = results.fee_types.data;
        this.loadingFeeTypes = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchDoctorFee$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDoctorFees = true),  // Show the loading spinner
        switchMap(term => this.doctorFeesService.getDoctorFees(1, term, this.selectedSchemeOption, this.selectedSpecialityOption, this.selectedDepartmentOption, this.selectedFeeTypeOption))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log("doctor_fees");
        this.doctor_fees = results.doctor_fees.data.map(element => ({
          id: element.id,
          name: `${element.doctor_specialization?.doctor?.salutation?.name} ${element.doctor_specialization?.doctor?.firstname} ${element.doctor_specialization?.doctor?.other_names} (${element.doctor_specialization?.doctor?.code})`,
          amount: element.amount,
          doctor_id: element.doctor_specialization?.doctor_id
        }));
        this.loadingDoctorFees = false;  // Hide the loading spinner when the API call finishes
      });
  }
  // Handle item selection
  onPatientSelect(event: any) {
    this.patient = event;
    this.patients = [];
    this.visitForm.get("patient_code")?.setValue(this.patient.code);
    this.patients.push({ ...this.patient, name: `CODE: ${this.patient.code} | NAME: ${this.patient.first_name} ${this.patient.other_names} | ID: ${this.patient.id_number} | PHONE: ${this.patient.phone}` });
    this.schemes = this.patient.patient_schemes.map(ps => {
      return {
        ...ps,
        id: ps.scheme_id,
        name: `${ps.scheme?.name} (${ps.scheme?.insurance?.name})`
      };
    });
    this.selectedPatientOption = this.patient.id;
    if (this.patient.image != null) {
      this.imageUrl = this.patient.image;
    }
    /*
    if (this.patient.sub_type) {
      this.schemes = [];
      this.schemes.push(this.patient.sub_type);
      this.selectedSchemeOption = this.patient.sub_type_id;
    }
    if (this.patient.fee_type) {
      this.fee_types = [];
      this.fee_types.push(this.patient.fee_type);
      this.selectedFeeTypeOption = this.patient.fee_type_id;
    }*/
    this.visitForm.get("organization")?.setValue(this.patient.organization_id);
    this.visitForm.get("branch")?.setValue(this.patient.branch_id);

  }

  setVisit(event: any) {
    this.patients = [];
    this.visitForm.get("id")?.setValue(this.outpatient_visit.id);
    this.visitForm.get("patient_code")?.setValue(this.outpatient_visit.patient.code);
    this.visitForm.get("doctor")?.setValue(this.outpatient_visit.doctor_id);
    this.visitForm.get("organization")?.setValue(this.outpatient_visit.organization_id>0?this.outpatient_visit.organization_id:this.outpatient_visit.patient.organization_id);
    this.visitForm.get("branch")?.setValue(this.outpatient_visit.branch_id);
    this.patients.push({ ...this.outpatient_visit.patient, name: `CODE: ${this.outpatient_visit.patient.code} | NAME: ${this.outpatient_visit.patient.first_name} ${this.outpatient_visit.patient.other_names} | ID: ${this.outpatient_visit.patient.id_number} | PHONE: ${this.outpatient_visit.patient.phone}` });
    this.selectedPatientOption = this.outpatient_visit.patient.id;
    if (this.outpatient_visit.patient.image != null) {
      this.imageUrl = this.outpatient_visit.patient.image;
    }
    if (this.outpatient_visit.patient.patient_schemes) {
      this.schemes = this.outpatient_visit.patient.patient_schemes.map(ps => {
        return {
          ...ps,
          id: ps.scheme_id,
          name: `${ps.scheme?.name} (${ps.scheme?.insurance?.name})`
        };
      });
      this.selectedSchemeOption = this.outpatient_visit.scheme_id;
    }
    if (this.outpatient_visit.fee_type) {
      this.fee_types = [];
      this.fee_types.push(this.outpatient_visit.fee_type);
      this.selectedFeeTypeOption = this.outpatient_visit.fee_type_id;
    }
    if (this.outpatient_visit.department) {
      this.departments = [];
      this.departments.push(this.outpatient_visit);
      this.selectedDepartmentOption = this.outpatient_visit.department_id;
    }
    if (this.outpatient_visit.specialization) {
      this.specialities = [];
      this.specialities.push(this.outpatient_visit.specialization);
      this.selectedSpecialityOption = this.outpatient_visit.specialization_id;
    }
    if (this.outpatient_visit.doctor_fee) {
      this.doctor_fees = [];
      this.doctor_fees.push({
        id: this.outpatient_visit.doctor_fee.id,
        name: `${this.outpatient_visit.doctor_fee.doctor_specialization?.doctor?.salutation?.name} ${this.outpatient_visit.doctor_fee.doctor_specialization?.doctor?.firstname} ${this.outpatient_visit.doctor_fee.doctor_specialization?.doctor?.other_names} (${this.outpatient_visit.doctor_fee.doctor_specialization?.doctor?.code})`,
        amount: this.outpatient_visit.doctor_fee.amount,
        doctor_id: this.outpatient_visit.doctor_fee.doctor_specialization?.doctor_id
      });
    this.visitForm.get("consultation_fees")?.setValue(this.outpatient_visit.doctor_fee.amount);
      this.selectedDoctorFeeOption = this.outpatient_visit.doctor_fee_id;
    }

  }

  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }
  onDoctorFeeSelect(event: any) {
    this.visitForm.get("consultation_fees")?.setValue(event.amount);
    this.visitForm.get("doctor")?.setValue(event.doctor_id);
    console.log('Doctor Fee:', event);
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("patient_id");
    if (id != null) {
      this.patientId = parseInt(id);
      this.isLoading = true;
      this.patientRegistrationService.getPatientRegistration(parseInt(id)).subscribe((result: any) => {
        this.patient = result.patient;
        this.onPatientSelect(this.patient);
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
      const id = this.activatedRoute.snapshot.paramMap.get("id");
      if (id != null) {
        this.visitId = parseInt(id);
        this.isLoading = true;
        this.outpatientVisitsService.getOutpatientVisit(parseInt(id)).subscribe((result: any) => {
          console.log(result);
          this.outpatient_visit = result.outpatient_visit;
          this.patient = result.outpatient_visit.patient;
          this.setVisit(this.outpatient_visit);
          this.isLoading = false;
        }, error => {
          if (error?.error?.message) {
            this.toastr.error(error?.error?.message);
            this.service.logout();
          }
          this.isLoading = false;
          console.log(error);
        });
      }
    }
  }

  imageCaptured(image: WebcamImage) {
    this.toastr.success("Patient Image Captured!");
    this.patientImage = image;
  }

  updatePatient() {
    console.log("visit",this.visitForm.getRawValue());
    if (this.visitForm.valid) {
      /*let formData = new FormData();
      if (this.patientImage != null) {
        // Convert the image data to a Blob
        const blob = this.dataURLtoBlob(this.patientImage.imageAsDataUrl);
        formData = this.createFormData(blob);
      }*/
      this.isLoading = true;
      this.outpatientVisitsService.updateOutpatientVisit(this.visitForm.getRawValue()).subscribe((result: any) => {
        if (result.success) {
          this.toastr.success(result.success);
          this.router.navigate(["/dashboard/visits/op/list"]);
        }
        this.isLoading = false;
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors.id[0]);
        }
        if (error?.error?.errors?.organization) {
          this.toastr.error(error?.error?.errors.organization[0]);
        }
        if (error?.error?.errors?.branch) {
          this.toastr.error(error?.error?.errors?.branch[0]);
        }
        if (error?.error?.errors?.scheme) {
          this.toastr.error(error?.error?.errors.scheme[0]);
        }
        if (error?.error?.errors?.department) {
          this.toastr.error(error?.error?.errors?.department[0]);
        }
        if (error?.error?.errors?.fee_type) {
          this.toastr.error(error?.error?.errors.fee_type[0]);
        }
        if (error?.error?.errors?.doctor_fee) {
          this.toastr.error(error?.error?.errors?.doctor_fee[0]);
        }
        if (error?.error?.errors?.speciality) {
          this.toastr.error(error?.error?.errors?.speciality[0]);
        }
        if (error?.error?.errors?.consultation_fees) {
          this.toastr.error(error?.error?.errors?.consultation_fees[0]);
        }
        if (error?.error?.errors?.status) {
          this.toastr.error(error?.error?.errors?.status[0]);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.visitForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
  // Convert the base64 image to Blob
  dataURLtoBlob(dataUrl: string): Blob {
    const byteString = atob(dataUrl.split(',')[1]);
    const mimeString = dataUrl.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);

    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
  }
  // Create FormData object to append form values and image
  createFormData(blob: Blob): FormData {
    const formData = new FormData();
    formData.append('photo', blob, 'photo.jpg');

    // Append other form data fields here
    Object.keys(this.visitForm.value).forEach(key => {
      formData.append(key, this.visitForm.get(key)?.value);
    });

    return formData;
  }
}


