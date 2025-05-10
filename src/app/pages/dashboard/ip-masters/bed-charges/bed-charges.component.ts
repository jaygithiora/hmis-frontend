import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { BedChargeSettingsService } from '@services/dashboard/ip-masters/bed-charge-settings/bed-charge-settings.service';
import { BedChargesService } from '@services/dashboard/ip-masters/bed-charges/bed-charges.service';
import { BedsService } from '@services/dashboard/ip-masters/beds/beds.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-bed-charges',
  templateUrl: './bed-charges.component.html',
  styleUrl: './bed-charges.component.scss'
})
export class BedChargesComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  loadingBCS: boolean = false;

  bedChargesForm!: FormGroup;

  beds: any[] = [];// ward fetched items
  bed_charge_settings: any[] = []

  selectedOption: any;
  selectedBCSOption: any;

  search$ = new Subject<string>();
  searchBCS$ = new Subject<string>();

  bed_charges: any[] = [];// ward fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private bedsService: BedsService, private bedChargesService:BedChargesService,
    private bedChargeSettingsService: BedChargeSettingsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.bedChargesForm = this.fb.group({
      id: ['0', [Validators.required]],
      bed_charge_setting: ['', [Validators.required]],
      bed: ['', [Validators.required]],
      amount: ['', [Validators.required]],
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
        switchMap(term => this.bedsService.getBeds(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.beds = results.beds.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
      this.searchBCS$
        .pipe(
          debounceTime(300),  // Wait for the user to stop typing for 300ms
          distinctUntilChanged(),  // Only search if the query has changed
          tap(() => this.loadingBCS = true),  // Show the loading spinner
          switchMap(term => this.bedChargeSettingsService.getBedChargeSettings(1, term))  // Switch to a new observable for each search term
        )
        .subscribe(results => {
          this.bed_charge_settings = results.bed_charge_settings.data;
          this.loadingBCS = false;  // Hide the loading spinner when the API call finishes
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
    this.bedChargesService.getBedCharges(page).subscribe((result: any) => {
      this.isLoading = false;
      this.bed_charges = result.bed_charges.data;// Set the items
      this.totalItems = result.bed_charges.total; // Total number of items
      this.perPage = result.bed_charges.per_page; // Items per page
      this.currentPage = result.bed_charges.current_page; // Set the current page
      this.toItems = result.bed_charges.to; // Set to Items
      this.fromItems = result.bed_charges.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, bed_charge: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (bed_charge != null) {
      this.bed_charge_settings = [];
      this.beds = [];
      this.bedChargesForm.get("id").setValue(bed_charge.id);
      this.beds.push(bed_charge.bed);
      this.selectedOption = bed_charge.bed_id;
      this.bed_charge_settings.push(bed_charge.bed_charge_setting);
      this.selectedBCSOption = bed_charge.bed_charge_setting_id;
      this.bedChargesForm.get("amount").setValue(bed_charge.amount);
      this.bedChargesForm.get("status").setValue(bed_charge.status);
    } else {
      this.bedChargesForm.get("id").setValue(0);
      this.bedChargesForm.get("amount").setValue("");
      this.selectedOption = null;
      this.selectedBCSOption = null;
      this.bedChargesForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.bedChargesForm.valid) {
      this.isLoading = true;
      this.bedChargesService.updateBedCharge(this.bedChargesForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.bed) {
          this.toastr.error(error?.error?.errors?.bed);
        }
        if (error?.error?.errors?.bed_charge_setting) {
          this.toastr.error(error?.error?.errors?.bed_charge_setting);
        }
        if (error?.error?.errors?.amount) {
          this.toastr.error(error?.error?.errors?.amount);
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


