import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { WardsService } from '@services/dashboard/ip-masters/wards/wards.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-wards',
  templateUrl: './wards.component.html',
  styleUrl: './wards.component.scss'
})
export class WardsComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  wardsForm!: FormGroup;

  locations: any[] = [];// ward fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  wards: any[] = [];// ward fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private wardsService: WardsService, private locationsService:LocationsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.wardsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      location: ['', [Validators.required]],
      deposit_amount: [''],
      age_from: [''],
      age_to: [''],
      gender: ['', [Validators.required]],
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
      .subscribe(results => {
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
    this.wardsService.getWards(page).subscribe((result: any) => {
      this.isLoading = false;
      this.wards = result.wards.data;// Set the items
      this.totalItems = result.wards.total; // Total number of items
      this.perPage = result.wards.per_page; // Items per page
      this.currentPage = result.wards.current_page; // Set the current page
      this.toItems = result.wards.to; // Set to Items
      this.fromItems = result.wards.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, ward: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (ward != null) {
      this.wardsForm.get("id").setValue(ward.id);
      this.wardsForm.get("name").setValue(ward.name);
      this.locations.push(ward.location);
      this.selectedOption = ward.location_id;
      this.wardsForm.get("deposit_amount").setValue(ward.deposit_amount);
      this.wardsForm.get("gender").setValue(ward.gender);
      this.wardsForm.get("age_from").setValue(ward.year_from);
      this.wardsForm.get("age_to").setValue(ward.year_to);
      this.wardsForm.get("status").setValue(ward.status);
    } else {
      this.wardsForm.get("id").setValue(0);
      this.wardsForm.get("name").setValue("");
      this.selectedOption = null;
      this.wardsForm.get("deposit_amount").setValue("");
      this.wardsForm.get("gender").setValue("ALL");
      this.wardsForm.get("age_from").setValue("");
      this.wardsForm.get("age_to").setValue("");
      this.wardsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.wardsForm.valid) {
      this.isLoading = true;
      this.wardsService.updateWard(this.wardsForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.errors?.location);
        }
        if (error?.error?.errors?.deposit_amount) {
          this.toastr.error(error?.error?.errors?.deposit_amount);
        }
        if (error?.error?.errors?.age_from) {
          this.toastr.error(error?.error?.errors?.age_from);
        }
        if (error?.error?.errors?.age_to) {
          this.toastr.error(error?.error?.errors?.age_to);
        }
        if (error?.error?.errors?.status) {
          this.toastr.error(error?.error?.errors?.status);
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
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

