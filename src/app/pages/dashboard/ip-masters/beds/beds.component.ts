import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { BedsService } from '@services/dashboard/ip-masters/beds/beds.service';
import { WardsService } from '@services/dashboard/ip-masters/wards/wards.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-beds',
  templateUrl: './beds.component.html',
  styleUrl: './beds.component.scss'
})
export class BedsComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  bedsForm!: FormGroup;

  wards: any[] = [];// ward fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  beds: any[] = [];// ward fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private wardsService: WardsService, private bedsService:BedsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.bedsForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      ward: ['', [Validators.required]],
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
        switchMap(term => this.wardsService.getWards(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.wards = results.wards.data;
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
    this.bedsService.getBeds(page).subscribe((result: any) => {
      this.isLoading = false;
      this.beds = result.beds.data;// Set the items
      this.totalItems = result.beds.total; // Total number of items
      this.perPage = result.beds.per_page; // Items per page
      this.currentPage = result.beds.current_page; // Set the current page
      this.toItems = result.beds.to; // Set to Items
      this.fromItems = result.beds.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, bed: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (bed != null) {
      this.bedsForm.get("id").setValue(bed.id);
      this.bedsForm.get("name").setValue(bed.name);
      this.wards.push(bed.ward);
      this.selectedOption = bed.ward_id;
      this.bedsForm.get("status").setValue(bed.status);
    } else {
      this.bedsForm.get("id").setValue(0);
      this.bedsForm.get("name").setValue("");
      this.selectedOption = null;
      this.bedsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.bedsForm.valid) {
      this.isLoading = true;
      this.bedsService.updateBed(this.bedsForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.ward) {
          this.toastr.error(error?.error?.errors?.ward);
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


