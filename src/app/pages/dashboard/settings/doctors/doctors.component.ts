import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DepartmentsService } from '@services/dashboard/masters/departments/departments.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import { DoctorsService } from '@services/dashboard/settings/doctors/doctors.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingDepartments: boolean = false;
  loadingUsers: boolean = false;
  loadingLocations: boolean = false;
  doctorsForm!: FormGroup;

  departments: any[] = [];
  users: any[] = [];
  locations: any[] = [];

  searchDepartments$ = new Subject<string>();
  searchUsers$ = new Subject<string>();
  searchLocations$ = new Subject<string>();

  selectedDepartmentOption: any;
  selectedUserOption: any;
  selectedLocationOption: any;

  doctors: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private doctorService: DoctorsService, private departmentService: DepartmentsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private usersService: UsersService, private locationsService: LocationsService) {
    this.doctorsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      department: ['', [Validators.required]],
      consultation_fees: ['', [Validators.required, Validators.min(0)]],
      user: ['', [Validators.required]],
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

    this.searchUsers$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingUsers = true),  // Show the loading spinner
        switchMap(term => this.usersService.getUsers(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.users = results.users.data.map(element => ({
          id: element.id,
          name: `${element.firstname} ${element.lastname} (${element.email})`
        }));
        this.loadingUsers = false;  // Hide the loading spinner when the API call finishes
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
    this.doctorService.getDoctors(page).subscribe((result: any) => {
      this.isLoading = false;
      this.doctors = result.doctors.data;// Set the items
      this.totalItems = result.doctors.total; // Total number of items
      this.perPage = result.doctors.per_page; // Items per page
      this.currentPage = result.doctors.current_page; // Set the current page
      this.toItems = result.doctors.to; // Set to Items
      this.fromItems = result.doctors.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, doctor: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (doctor != null) {
      this.departments = [];
      this.users = [];
      this.locations = [];
      this.doctorsForm.get("id").setValue(doctor.id);
      this.doctorsForm.get("name").setValue(doctor.name);
      if (doctor.department_id != null) {
        this.departments.push(doctor.department);
        this.selectedDepartmentOption = doctor.department_id;
      }
      if (doctor.user_id != null) {
        this.users.push({
          id: doctor.user.id,
          name: `${doctor.user.firstname} ${doctor.user.lastname} (${doctor.user.email})`
        });
        this.selectedUserOption = doctor.user_id;
      }
      if (doctor.location_id != null) {
        this.locations.push(doctor.location);
        this.selectedLocationOption = doctor.location_id;
      }
      this.doctorsForm.get("consultation_fees").setValue(doctor.consultation_fees);
      this.doctorsForm.get("status").setValue(doctor.status);
    } else {
      this.doctorsForm.get("id").setValue(0);
      this.doctorsForm.get("name").setValue("");
      this.doctorsForm.get("description").setValue("");
      this.selectedDepartmentOption = null;
      this.selectedUserOption = null;
      this.doctorsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.doctorsForm.valid) {
      this.isLoading = true;
      this.doctorService.updateDoctor(this.doctorsForm.getRawValue()).subscribe((result: any) => {
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
          this.modalRef?.close();
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

