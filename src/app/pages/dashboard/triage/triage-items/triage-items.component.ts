import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DepartmentsService } from '@services/dashboard/masters/triage_categories/triage_categories.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import { DoctorsService } from '@services/dashboard/settings/triage_items/triage_items.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { TriageItemsService } from '@services/dashboard/triage/triage-items/triage-items.service';
import { TriageCategoriesService } from '@services/dashboard/triage/triage-categories/triage-categories.service';

@Component({
  selector: 'app-triage-items',
  templateUrl: './triage-items.component.html',
  styleUrl: './triage-items.component.scss'
})
export class TriageItemsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  triageItemsForm!: FormGroup;

  triage_categories: any[] = [];

  search$ = new Subject<string>();

  selectedOption: any;

  triage_items: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private triageItemsService: TriageItemsService, private triageCategoriesService: TriageCategoriesService, 
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.triageItemsForm = this.fb.group({
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
    this.search$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loading = true),  // Show the loading spinner
        switchMap(term => this.triageCategoriesService.getTriageCategories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.triage_categories = results.triage_categories.data;
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
    this.isLoading = true;
    this.triageItemsService.getTriageItems(page).subscribe((result: any) => {
      this.isLoading = false;
      this.triage_items = result.triage_items.data;// Set the items
      this.totalItems = result.triage_items.total; // Total number of items
      this.perPage = result.triage_items.per_page; // Items per page
      this.currentPage = result.triage_items.current_page; // Set the current page
      this.toItems = result.triage_items.to; // Set to Items
      this.fromItems = result.triage_items.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, doctor: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (doctor != null) {
      this.triage_categories = [];
      this.users = [];
      this.locations = [];
      this.triageItemsForm.get("id").setValue(doctor.id);
      this.triageItemsForm.get("name").setValue(doctor.name);
      if (doctor.department_id != null) {
        this.triage_categories.push(doctor.department);
        this.selectedOption = doctor.department_id;
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
      this.triageItemsForm.get("consultation_fees").setValue(doctor.consultation_fees);
      this.triageItemsForm.get("status").setValue(doctor.status);
    } else {
      this.triageItemsForm.get("id").setValue(0);
      this.triageItemsForm.get("name").setValue("");
      this.triageItemsForm.get("description").setValue("");
      this.selectedOption = null;
      this.selectedUserOption = null;
      this.triageItemsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.triageItemsForm.valid) {
      this.isLoading = true;
      this.doctorService.updateDoctor(this.triageItemsForm.getRawValue()).subscribe((result: any) => {
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


