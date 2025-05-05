import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DepartmentsService } from '@services/dashboard/masters/departments/departments.service';
import { DoctorsService } from '@services/dashboard/settings/doctors/doctors.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit {
  public isLoading: boolean = true;
  loading: boolean = false;
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
    private service: AuthService) {
    this.doctorsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      department: ['', [Validators.required]],
      consultation_fees:['', [Validators.required, Validators.min(0)]],
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
        tap(() => this.loading = true),  // Show the loading spinner
        switchMap(term => this.departmentService.getDepartments(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.departments = results.departments.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
      this.searchLocations$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loading = true),  // Show the loading spinner
          switchMap(term => this.departmentService.getDepartments(1, term))  // Switch to a new observable for each search term
        )
        .subscribe(results => {
          this.departments = results.departments.data;
          this.loading = false;  // Hide the loading spinner when the API call finishes
        });
        this.searchUsers$
          .pipe(
            debounceTime(300),  // Wait for the user to stop typing for 300ms
            distinctUntilChanged(),  // Only search if the query has changed
            tap(() => this.loading = true),  // Show the loading spinner
            switchMap(term => this.departmentService.getDepartments(1, term))  // Switch to a new observable for each search term
          )
          .subscribe(results => {
            this.departments = results.departments.data;
            this.loading = false;  // Hide the loading spinner when the API call finishes
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

  openModal(content: TemplateRef<any>, sub_type: any) {
    this.modalService.open(content, { centered: true });
    if (sub_type != null) {
      this.doctorsForm.get("id").setValue(sub_type.id);
      this.doctorsForm.get("name").setValue(sub_type.name);
      this.doctorsForm.get("description").setValue(sub_type.description);
      //this.main_types.push(sub_type.main_type);
      //this.selectedOption = sub_type.main_type_id;
      this.doctorsForm.get("status").setValue(sub_type.status);
    } else {
      this.doctorsForm.get("id").setValue(0);
      this.doctorsForm.get("name").setValue("");
      this.doctorsForm.get("description").setValue("");
      //this.selectedOption = null;
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

