import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ConsultationTypesService } from '@services/dashboard/masters/consultation-types/consultation-types.service';
import { DepartmentsService } from '@services/dashboard/masters/departments/departments.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import { MainTypesService } from '@services/dashboard/masters/manin-types/main-types.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import { DoctorsService } from '@services/dashboard/settings/doctors/doctors.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-consultation-types',
  templateUrl: './consultation-types.component.html',
  styleUrl: './consultation-types.component.scss'
})
export class ConsultationTypesComponent implements OnInit {
  public isLoading: boolean = true;
  loadingDepartments: boolean = false;
  loadingMainType: boolean = false;
  loadingLocations: boolean = false;
  loadingSubTypes: boolean = false;
  loadingDoctors: boolean = false;

  consultationTypesForm!: FormGroup;

  departments: any[] = [];
  mainTypes: any[] = [];
  locations: any[] = [];
  subTypes: any[] = [];
  doctors: any[] = [];

  searchDepartments$ = new Subject<string>();
  searchMainTypes$ = new Subject<string>();
  searchLocations$ = new Subject<string>();
  searchSubTypes$ = new Subject<string>();
  searchDoctors$ = new Subject<string>();

  selectedDepartmentOption: any;
  selectedMainTypeOption: any;
  selectedLocationOption: any;
  selectedSubTypeOption: any;
  selectedDoctorOption: any;

  consultation_types: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private consultationTypesService: ConsultationTypesService, private departmentService: DepartmentsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private subTypesService: SubTypesService,
    private service: AuthService, private mainTypesService: MainTypesService, private locationsService: LocationsService,
    private doctorsService: DoctorsService) {
    this.consultationTypesForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      department: ['', [Validators.required]],
      main_type: ['', [Validators.required]],
      sub_type: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      consultation_fees: ['', [Validators.required, Validators.min(0)]],
      location: [''],
      status: ['1', [Validators.required]]
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchDepartments$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDepartments = true),  // Show the loading spinner
        switchMap(term => this.departmentService.getDepartments(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.departments = results.departments.data;
        this.loadingDepartments = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchLocations$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingLocations = true),  // Show the loading spinner
        switchMap(term => this.locationsService.getLocations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.locations = results.locations.data;
        this.loadingLocations = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchMainTypes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingMainType = true),  // Show the loading spinner
        switchMap(term => this.mainTypesService.getMainTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.mainTypes = results.main_types.data;
        this.loadingMainType = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchSubTypes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSubTypes = true),  // Show the loading spinner
        switchMap(term => this.subTypesService.getSubTypes(1, term, this.selectedMainTypeOption))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.subTypes = results.sub_types.data;
        this.loadingSubTypes = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchDoctors$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDoctors = true),  // Show the loading spinner
        switchMap(term => this.doctorsService.getDoctors(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.doctors = results.doctors.data;
        this.loadingDoctors = false;  // Hide the loading spinner when the API call finishes
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
    this.consultationTypesService.getConsultationTypes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.consultation_types = result.consultation_types.data;// Set the items
      this.totalItems = result.consultation_types.total; // Total number of items
      this.perPage = result.consultation_types.per_page; // Items per page
      this.currentPage = result.consultation_types.current_page; // Set the current page
      this.toItems = result.consultation_types.to; // Set to Items
      this.fromItems = result.consultation_types.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, consultation_type: any) {
    this.modalService.open(content, { centered: true });
    if (consultation_type != null) {
      this.consultationTypesForm.get("id").setValue(consultation_type.id);
      this.consultationTypesForm.get("name").setValue(consultation_type.name);
      if (consultation_type.department_id != null) {
        this.departments.push(consultation_type.department);
        this.selectedDepartmentOption = consultation_type.department_id;
      }
      if (consultation_type.main_type_id != null) {
        this.mainTypes.push(consultation_type.main_type);
        this.selectedMainTypeOption = consultation_type.main_type_id;
      }
      if (consultation_type.sub_type_id != null) {
        this.subTypes.push(consultation_type.sub_type);
        this.selectedSubTypeOption = consultation_type.sub_type_id;
      }
      if (consultation_type.location_id != null) {
        this.locations.push(consultation_type.location);
        this.selectedLocationOption = consultation_type.location_id;
      }
      if (consultation_type.doctor_id != null) {
        this.doctors.push(consultation_type.doctor);
        this.selectedDoctorOption = consultation_type.doctor_id;
      }
      this.consultationTypesForm.get("consultation_fees").setValue(consultation_type.consultation_fees);
      this.consultationTypesForm.get("status").setValue(consultation_type.status);
    } else {
      this.consultationTypesForm.get("id").setValue(0);  
      this.consultationTypesForm.get("name").setValue("");
      this.selectedDepartmentOption = null;
      this.selectedMainTypeOption = null;
      this.selectedSubTypeOption = null;
      this.selectedLocationOption = null;
      this.selectedDoctorOption = null;
      this.consultationTypesForm.get("consultation_fees").setValue("");
      this.consultationTypesForm.get("status").setValue("1");
    }
  }
  addLocation() {
    if (this.consultationTypesForm.valid) {
      this.isLoading = true;
      this.consultationTypesService.updateConsultationType(this.consultationTypesForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.name) {
          this.toastr.error(error?.error?.errors?.name);
        }
        if (error?.error?.errors?.description) {
          this.toastr.error(error?.error?.errors?.description);
        }
        if (error?.error?.errors?.main_type) {
          this.toastr.error(error?.error?.errors?.main_type);
        }
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
    } else {
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

