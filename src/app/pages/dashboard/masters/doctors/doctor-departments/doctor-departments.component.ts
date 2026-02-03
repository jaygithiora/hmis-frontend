import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DepartmentsService } from '@services/dashboard/masters/departments/departments.service';
import { DoctorDepartmentsService } from '@services/dashboard/masters/doctors/doctor-departments/doctor-departments.service';
import { DoctorsService } from '@services/dashboard/masters/doctors/doctors/doctors.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-doctor-departments',
  templateUrl: './doctor-departments.component.html',
  styleUrl: './doctor-departments.component.scss'
})
export class DoctorDepartmentsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingDepartments: boolean = false;
  loadingDoctors: boolean = false;

  doctorDepartmentForm!: FormGroup;

  doctors: any[] = [];
  departments: any[] = [];

  searchDoctors$ = new Subject<string>();
  searchDepartments$ = new Subject<string>();

  selectedDoctor: any;
  selectedDepartment: any;

  doctor_departments: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private departmentsService: DepartmentsService, private doctorDepartmentsService: DoctorDepartmentsService,
    private doctorsService:DoctorsService, private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,private service: AuthService, private usersService: UsersService) {
    this.doctorDepartmentForm = this.fb.group({
      id: ['0', [Validators.required]],
      department: [null, [Validators.required]],
      doctor: [null, [Validators.required]],
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchDepartments$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDepartments = true),  // Show the loading spinner
        switchMap(term => this.departmentsService.getDepartments(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.departments = results.departments.data;
        this.loadingDepartments = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchDoctors$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDoctors = true),  // Show the loading spinner
        switchMap(term => this.doctorsService.getDoctors(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.doctors = results.doctors.data.map(element => ({
          id: element.id,
          name: `${element.salutation?.name} ${element.firstname} ${element.other_names} (${element.code})`
        }));
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
    this.isLoading = true;
    this.doctorDepartmentsService.getDoctorDepartments(page).subscribe((result: any) => {
      this.isLoading = false;
      this.doctor_departments = result.doctor_departments.data;// Set the items
      this.totalItems = result.doctor_departments.total; // Total number of items
      this.perPage = result.doctor_departments.per_page; // Items per page
      this.currentPage = result.doctor_departments.current_page; // Set the current page
      this.toItems = result.doctor_departments.to; // Set to Items
      this.fromItems = result.doctor_departments.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, doctorDepartment: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (doctorDepartment != null) {
      this.departments = [];
      this.doctors = [];
      this.departments = [];
      this.doctorDepartmentForm.get("id").setValue(doctorDepartment.id);
      if (doctorDepartment.department_id != null) {
        this.departments.push(doctorDepartment.department);
        this.selectedDepartment = doctorDepartment.department_id;
      }
      if (doctorDepartment.doctor_id != null) {
        this.doctors.push({id:doctorDepartment.doctor.id, name:`${doctorDepartment.doctor?.firstname} ${doctorDepartment.doctor?.other_names} (${doctorDepartment.doctor?.code})`});
        this.selectedDoctor = doctorDepartment.doctor_id;
      }
    } else {
      this.doctorDepartmentForm.get("id").setValue(0);
      this.selectedDepartment=null;
      this.selectedDoctor = null;
    }
  }
  addDoctorDepartment() {
    if (this.doctorDepartmentForm.valid) {
      this.isLoading = true;
      this.doctorDepartmentsService.updateDoctorDepartment(this.doctorDepartmentForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.doctor) {
          this.toastr.error(error?.error?.errors?.doctor);
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
      this.doctorDepartmentForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

