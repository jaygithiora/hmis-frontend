import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import { RadiologyItemRatesService } from '@services/dashboard/radiology/radiology-item-rates/radiology-item-rates.service';
import { RadiologyItemsService } from '@services/dashboard/radiology/radiology-items/radiology-items.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-radiology-item-rates',
  templateUrl: './radiology-item-rates.component.html',
  styleUrl: './radiology-item-rates.component.scss'
})
export class RadiologyItemRatesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingRadiologyItems: boolean = false;
  loadingSubTypes: boolean = false;

  radiologyItemRateForm!: FormGroup;

radiology_items: any[] = [];
  sub_types: any[] = [];

  searchRadiologyItems$ = new Subject<string>();
  searchSubTypes$ = new Subject<string>();

  selectedRadiologyItemOption: any;
  selectedSubTypeOption: any;

  radiology_item_rates: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private radiologyItemsService: RadiologyItemsService, private subTypeService: SubTypesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private radiologyItemRatesService: RadiologyItemRatesService) {
    this.radiologyItemRateForm = this.fb.group({
      id: ['0', [Validators.required]],
      radiology_item: ['', [Validators.required]],
      sub_type: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['1', [Validators.required]]
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchRadiologyItems$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingRadiologyItems = true),  // Show the loading spinner
        switchMap(term => this.radiologyItemsService.getRadiologyItems(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.radiology_items = results.radiology_items.data;
        this.loadingRadiologyItems = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSubTypes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSubTypes = true),  // Show the loading spinner
        switchMap(term => this.subTypeService.getSubTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.sub_types = results.sub_types.data;
        this.loadingSubTypes = false;  // Hide the loading spinner when the API call finishes
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
    this.radiologyItemRatesService.getRadiologyItemRates(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.radiology_item_rates = result.radiology_item_rates.data;// Set the items
      this.totalItems = result.radiology_item_rates.total; // Total number of items
      this.perPage = result.radiology_item_rates.per_page; // Items per page
      this.currentPage = result.radiology_item_rates.current_page; // Set the current page
      this.toItems = result.radiology_item_rates.to; // Set to Items
      this.fromItems = result.radiology_item_rates.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, radiology_item_rate: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (radiology_item_rate != null) {
      this.radiologyItemRateForm.get("id").setValue(radiology_item_rate.id);
      this.radiologyItemRateForm.get("amount").setValue(radiology_item_rate.amount);
        this.radiology_items.push(radiology_item_rate.radiology_item);
        this.selectedRadiologyItemOption = radiology_item_rate.radiology_item_id;
        this.sub_types.push(radiology_item_rate.sub_type);
        this.selectedSubTypeOption = radiology_item_rate.sub_type_id;
      this.radiologyItemRateForm.get("status").setValue(radiology_item_rate.status);
    } else {
      this.radiologyItemRateForm.get("id").setValue(0);
      this.radiologyItemRateForm.get("amount").setValue("");
      this.selectedRadiologyItemOption = null;
      this.selectedSubTypeOption = null;
      this.radiologyItemRateForm.get("status").setValue("1");
    }
  }
  addLocation() {
    if (this.radiologyItemRateForm.valid) {
      this.isLoading = true;
      this.radiologyItemRatesService.updateRadiologyItemRates(this.radiologyItemRateForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.sub_type) {
          this.toastr.error(error?.error?.errors?.sub_type);
        }
        if (error?.error?.errors?.laboratory_test) {
          this.toastr.error(error?.error?.errors?.laboratory_test);
        }
        if (error?.error?.errors?.amount) {
          this.toastr.error(error?.error?.errors?.amount);
        }
        if (error?.error?.errors?.status) {
          this.toastr.error(error?.error?.errors?.status);
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




