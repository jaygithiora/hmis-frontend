import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DoctorsService } from '@services/dashboard/masters/doctors/doctors/doctors.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';
import { SalutationService } from '@services/dashboard/masters/salutation/salutation.service';
import { DoctorCategoriesService } from '@services/dashboard/masters/doctors/doctor-categories/doctor-categories.service';
import { OrganizationsService } from '@services/dashboard/organizations/organizations.service';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrl: './doctors.component.scss'
})
export class DoctorsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingSalutations: boolean = false;
  loadingUsers: boolean = false;
  loadingDoctorCategories: boolean = false;
  loadingOrganizations: boolean = false;

  doctorsForm!: FormGroup;

  salutations: any[] = [];
  users: any[] = [];
  doctor_categories: any[] = [];
  organizations: any[] = [];

  searchSalutations$ = new Subject<string>();
  searchUsers$ = new Subject<string>();
  searchDoctorCategories$ = new Subject<string>();
  searchOrganizations$ = new Subject<string>();

  selectedSalutationOption: any;
  selectedUserOption: any;
  selectedDoctorCategory: any;
  selectedOrganization: any;

  doctors: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  doctor_types = [{id: "Residential",name:"Residential"}, {id:"Private",name:"Private"}];

  constructor(private doctorService: DoctorsService, private salutationsService: SalutationService,private doctorCategoriesService:DoctorCategoriesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private usersService: UsersService, private organizationService: OrganizationsService) {
    this.doctorsForm = this.fb.group({
      id: ['0', [Validators.required]],
      firstname: ['', [Validators.required]],
      other_names: ['', [Validators.required]],
      registration_number: ['', [Validators.required]],
      description: [''],
      salutation: [null, [Validators.required]],
      doctor_type:['Residential',[Validators.required]],
      doctor_category: [null, [Validators.required]],
      user: [null, [Validators.required]],
      organization: [null, [Validators.required]],
      status: ['1', [Validators.required]]
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchSalutations$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSalutations = true),  // Show the loading spinner
        switchMap(term => this.salutationsService.getSalutations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.salutations = results.salutations.data;
        this.loadingSalutations = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchDoctorCategories$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDoctorCategories = true),  // Show the loading spinner
        switchMap(term => this.doctorCategoriesService.getDoctorCategories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        console.log(results);
        this.doctor_categories = results.doctor_categories.data;
        this.loadingDoctorCategories = false;  // Hide the loading spinner when the API call finishes
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
    this.searchOrganizations$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingOrganizations = true),  // Show the loading spinner
        switchMap(term => this.organizationService.getOrganizations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.organizations = results.organizations.data;
        this.loadingOrganizations = false;  // Hide the loading spinner when the API call finishes
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
      this.salutations = [];
      this.users = [];
      this.doctor_categories = [];
      this.doctorsForm.get("id").setValue(doctor.id);
      this.doctorsForm.get("firstname").setValue(doctor.firstname);
      this.doctorsForm.get("other_names").setValue(doctor.other_names);
      if (doctor.organization_id != null) {
        this.organizations.push(doctor.organization);
        this.selectedOrganization = doctor.organization_id;
      }
      if (doctor.salutation_id != null) {
        this.salutations.push(doctor.salutation);
        this.selectedSalutationOption = doctor.salutation_id;
      }
      if (doctor.doctor_category_id != null) {
        this.doctor_categories.push(doctor.doctor_category);
        this.selectedDoctorCategory = doctor.doctor_category_id;
      }
      if (doctor.user_id != null) {
        this.users.push({
          id: doctor.user.id,
          name: `${doctor.user.firstname} ${doctor.user.lastname} (${doctor.user.email})`
        });
        this.selectedUserOption = doctor.user_id;
      }
      this.doctorsForm.get("registration_number").setValue(doctor.registration_number);
      this.doctorsForm.get("doctor_type").setValue(doctor.doctor_type);
      this.doctorsForm.get("status").setValue(doctor.status);
    } else {
      this.doctorsForm.get("id").setValue(0);
      this.doctorsForm.get("firstname").setValue("");
      this.doctorsForm.get("other_names").setValue("");
      this.doctorsForm.get("description").setValue("");
      this.selectedSalutationOption = null;
      this.selectedDoctorCategory=null;
      this.selectedOrganization=null;
      this.selectedUserOption = null;
      this.doctorsForm.get("status").setValue(1);
      this.doctorsForm.get("registration_number").setValue("");
      this.doctorsForm.get("doctor_type").setValue("Residential");
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
        if (error?.error?.errors?.firstname) {
          this.toastr.error(error?.error?.errors?.firstname);
        }
        if (error?.error?.errors?.other_names) {
          this.toastr.error(error?.error?.errors?.other_names);
        }
        if (error?.error?.errors?.registration_number) {
          this.toastr.error(error?.error?.errors?.registration_number);
        }
        if (error?.error?.errors?.description) {
          this.toastr.error(error?.error?.errors?.description);
        }
        if (error?.error?.errors?.doctor_type) {
          this.toastr.error(error?.error?.errors?.doctor_type);
        }
        if (error?.error?.errors?.doctor_category) {
          this.toastr.error(error?.error?.errors?.doctor_category);
        }
        if (error?.error?.errors?.salutation) {
          this.toastr.error(error?.error?.errors?.salutation);
        }
        if (error?.error?.errors?.user) {
          this.toastr.error(error?.error?.errors?.user);
        }
        if (error?.error?.errors?.doctor_type) {
          this.toastr.error(error?.error?.errors?.doctor_type);
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
      this.doctorsForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

