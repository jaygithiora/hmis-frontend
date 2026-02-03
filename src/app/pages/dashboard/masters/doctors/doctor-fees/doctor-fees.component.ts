import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { DoctorSpecializationsService } from '@services/dashboard/masters/doctors/doctor-specializations/doctor-specializations.service';
import { SchemesService } from '@services/dashboard/masters/insurances/schemes/schemes.service';
import { FeeTypesService } from '@services/dashboard/settings/fee-types/fee-types.service';
import { DoctorFeesService } from '@services/dashboard/masters/doctors/doctor-fees/doctor-fees.service';

@Component({
  selector: 'app-doctor-fees',
  templateUrl: './doctor-fees.component.html',
  styleUrl: './doctor-fees.component.scss'
})
export class DoctorFeesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingFeeTypes: boolean = false;
  loadingDoctorSpecializations: boolean = false;
  loadingSchemes: boolean = false;

  doctorFeeForm!: FormGroup;

  doctor_specializations: any[] = [];
  schemes: any[] = [];
  fee_types: any[] = [];

  searchSpecialization$ = new Subject<string>();
  searchSchemes$ = new Subject<string>();
  searchFeeTypes$ = new Subject<string>();

  selectedDoctorSpecialization: any;
  selectedScheme: any;
  selectedFeeType: any;

  doctor_fees: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private doctorSpecializationsService: DoctorSpecializationsService, private schemesService: SchemesService,
    private feeTypeService:FeeTypesService, private doctorFeesService:DoctorFeesService, private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,private service: AuthService, private usersService: UsersService) {
    this.doctorFeeForm = this.fb.group({
      id: ['0', [Validators.required]],
      specialization: [null, [Validators.required]],
      scheme: [null, [Validators.required]],
      fee_type: [null, [Validators.required]],
      amount: [null, [Validators.required]],
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchFeeTypes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingFeeTypes = true),  // Show the loading spinner
        switchMap(term => this.feeTypeService.getFeeTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.fee_types = results.fee_types.data;
        this.loadingFeeTypes = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSpecialization$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDoctorSpecializations = true),  // Show the loading spinner
        switchMap(term => this.doctorSpecializationsService.getDoctorSpecializations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.doctor_specializations = results.doctor_specializations.data.map(element => ({
          id: element.id,
          name: `${element?.specialization?.name} - ${element?.doctor?.salutation?.name} ${element?.doctor?.firstname} ${element?.doctor?.other_names} (${element?.doctor?.code})`
        }));
        this.loadingDoctorSpecializations = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSchemes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSchemes = true),  // Show the loading spinner
        switchMap(term => this.schemesService.getSchemes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.schemes = results.schemes.data;
        this.loadingSchemes = false;  // Hide the loading spinner when the API call finishes
      });
  }
  // Handle item selection
  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.doctorFeesService.getDoctorFees(page).subscribe((result: any) => {
      this.isLoading = false;
      this.doctor_fees = result.doctor_fees.data;// Set the items
      this.totalItems = result.doctor_fees.total; // Total number of items
      this.perPage = result.doctor_fees.per_page; // Items per page
      this.currentPage = result.doctor_fees.current_page; // Set the current page
      this.toItems = result.doctor_fees.to; // Set to Items
      this.fromItems = result.doctor_fees.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, doctorFee: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (doctorFee != null) {
      this.schemes = [];
      this.doctor_specializations = [];
      this.fee_types = [];
      this.doctorFeeForm.get("id").setValue(doctorFee.id);
      this.doctorFeeForm.get("amount").setValue(doctorFee.amount);
      if (doctorFee.fee_type != null) {
        this.fee_types.push(doctorFee.fee_type);
        this.selectedFeeType = doctorFee.fee_type_id;
      }
      if (doctorFee.doctor_specialization != null) {
        this.doctor_specializations.push({id:doctorFee.doctor_specialization_id, name:`${doctorFee?.doctor_specialization?.specialization?.name} - ${doctorFee.doctor_specialization?.doctor?.firstname} ${doctorFee.doctor_specialization?.doctor?.other_names} (${doctorFee.doctor_specialization?.doctor?.code})`});
        this.selectedDoctorSpecialization = doctorFee.doctor_specialization_id;
      }
      if (doctorFee.scheme != null) {
        this.schemes.push(doctorFee?.scheme);
        this.selectedScheme = doctorFee.scheme_id;
      }
    } else {
      this.doctorFeeForm.get("id").setValue(0);
      this.doctorFeeForm.get("amount").setValue("");
      this.selectedDoctorSpecialization=null;
      this.selectedScheme = null;
      this.selectedFeeType = null;
    }
  }
  addDoctorFee() {
    if (this.doctorFeeForm.valid) {
      this.isLoading = true;
      this.doctorFeesService.updateDoctorFee(this.doctorFeeForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.specialization) {
          this.toastr.error(error?.error?.errors?.specialization);
        }
        if (error?.error?.errors?.scheme) {
          this.toastr.error(error?.error?.errors?.scheme);
        }
        if (error?.error?.errors?.fee_type) {
          this.toastr.error(error?.error?.errors?.fee_type);
        }
        if (error?.error?.error) {
          this.toastr.error(error?.error?.error);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
          this.modalRef?.close();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.doctorFeeForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

