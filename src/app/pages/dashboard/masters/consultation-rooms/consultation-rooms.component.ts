import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ConsultationRoomsService } from '@services/dashboard/masters/consultation-rooms/consultation-rooms.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import { DoctorsService } from '@services/dashboard/masters/doctors/doctors/doctors.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-consultation-rooms',
  templateUrl: './consultation-rooms.component.html',
  styleUrl: './consultation-rooms.component.scss'
})
export class ConsultationRoomsComponent  implements OnInit {
  private modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  consultationRoomsForm!: FormGroup;

  locations: any[] = [];

  search$ = new Subject<string>();

  selectedOption: any;

  consultation_rooms: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private consultationRoomsService: ConsultationRoomsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private locationsService: LocationsService,
    private doctorsService: DoctorsService) {
    this.consultationRoomsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      location: ['', [Validators.required]],
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
        switchMap(term => this.locationsService.getLocations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.locations = results.locations.data;
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
    this.consultationRoomsService.getConsultationTypes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.consultation_rooms = result.consultation_rooms.data;// Set the items
      this.totalItems = result.consultation_rooms.total; // Total number of items
      this.perPage = result.consultation_rooms.per_page; // Items per page
      this.currentPage = result.consultation_rooms.current_page; // Set the current page
      this.toItems = result.consultation_rooms.to; // Set to Items
      this.fromItems = result.consultation_rooms.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, consultation_room: any) {
    this.modalRef =  this.modalService.open(content, { centered: true });
    if (consultation_room != null) {
      this.consultationRoomsForm.get("id").setValue(consultation_room.id);
      this.consultationRoomsForm.get("name").setValue(consultation_room.name);

      if (consultation_room.location_id != null) {
        this.locations.push(consultation_room.location);
        this.selectedOption = consultation_room.location_id;
      }
      this.consultationRoomsForm.get("description").setValue(consultation_room.description);
      this.consultationRoomsForm.get("status").setValue(consultation_room.status);
    } else {
      this.consultationRoomsForm.get("id").setValue(0);
      this.consultationRoomsForm.get("name").setValue("");
      this.selectedOption = null;
      this.consultationRoomsForm.get("description").setValue("");
      this.consultationRoomsForm.get("status").setValue("1");
    }
  }
  addLocation() {
    if (this.consultationRoomsForm.valid) {
      this.isLoading = true;
      this.consultationRoomsService.updateConsultationType(this.consultationRoomsForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.errors?.location);
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

