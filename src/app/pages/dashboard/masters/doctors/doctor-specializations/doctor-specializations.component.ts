import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DoctorSpecializationsService } from '@services/dashboard/masters/doctors/doctor-specializations/doctor-specializations.service';
import { DoctorsService } from '@services/dashboard/masters/doctors/doctors/doctors.service';
import { SpecializationsService } from '@services/dashboard/settings/specializations/specializations.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-doctor-specializations',
  templateUrl: './doctor-specializations.component.html',
  styleUrl: './doctor-specializations.component.scss'
})
export class DoctorSpecializationsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingSpecializations: boolean = false;
  loadingDoctors: boolean = false;

  doctorSpecializationForm!: FormGroup;

  doctors: any[] = [];
  specializations: any[] = [];

  searchDoctors$ = new Subject<string>();
  searchSpecializations$ = new Subject<string>();

  selectedDoctor: any;
  selectedSpecialization: any;

  doctor_specializations: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private specializationsService: SpecializationsService, private doctorSpecializationService: DoctorSpecializationsService,
    private doctorsService:DoctorsService, private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,private service: AuthService, private usersService: UsersService) {
    this.doctorSpecializationForm = this.fb.group({
      id: ['0', [Validators.required]],
      specialization: [null, [Validators.required]],
      doctor: ['', [Validators.required]],
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchSpecializations$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSpecializations = true),  // Show the loading spinner
        switchMap(term => this.specializationsService.getSpecializations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.specializations = results.specializations.data;
        this.loadingSpecializations = false;  // Hide the loading spinner when the API call finishes
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
    this.doctorSpecializationService.getDoctorSpecializations(page).subscribe((result: any) => {
      this.isLoading = false;
      this.doctor_specializations = result.doctor_specializations.data;// Set the items
      this.totalItems = result.doctor_specializations.total; // Total number of items
      this.perPage = result.doctor_specializations.per_page; // Items per page
      this.currentPage = result.doctor_specializations.current_page; // Set the current page
      this.toItems = result.doctor_specializations.to; // Set to Items
      this.fromItems = result.doctor_specializations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, doctorSpecialization: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (doctorSpecialization != null) {
      this.specializations = [];
      this.doctors = [];
      this.specializations = [];
      this.doctorSpecializationForm.get("id").setValue(doctorSpecialization.id);
      if (doctorSpecialization.specialization_id != null) {
        this.specializations.push(doctorSpecialization.specialization);
        this.selectedSpecialization = doctorSpecialization.specialization_id;
      }
      if (doctorSpecialization.doctor_id != null) {
        this.doctors.push({id:doctorSpecialization.doctor.id, name:`${doctorSpecialization.doctor?.firstname} ${doctorSpecialization.doctor?.other_names} (${doctorSpecialization.doctor?.code})`});
        this.selectedDoctor = doctorSpecialization.doctor_id;
      }
    } else {
      this.doctorSpecializationForm.get("id").setValue(0);
      this.selectedSpecialization=null;
      this.selectedDoctor = null;
    }
  }
  addDoctorSpecialization() {
    if (this.doctorSpecializationForm.valid) {
      this.isLoading = true;
      this.doctorSpecializationService.updateDoctorSpecialization(this.doctorSpecializationForm.getRawValue()).subscribe((result: any) => {
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
      this.doctorSpecializationForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

