import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import { ServiceRatesService } from '@services/dashboard/services/service-rates/service-rates.service';
import { ServicesService } from '@services/dashboard/services/services/services.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-service-rates',
  templateUrl: './service-rates.component.html',
  styleUrl: './service-rates.component.scss'
})
export class ServiceRatesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingServices: boolean = false;
  loadingSubTypes: boolean = false;

  serviceRateForm!: FormGroup;

services: any[] = [];
  sub_types: any[] = [];

  searchServices$ = new Subject<string>();
  searchSubTypes$ = new Subject<string>();

  selectedServiceOption: any;
  selectedSubTypeOption: any;

  service_rates: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private serviceService: ServicesService, private subTypeService: SubTypesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private serviceRateService: ServiceRatesService) {
    this.serviceRateForm = this.fb.group({
      id: ['0', [Validators.required]],
      service: ['', [Validators.required]],
      sub_type: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['1', [Validators.required]]
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchServices$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingServices = true),  // Show the loading spinner
        switchMap(term => this.serviceService.getServices(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.services = results.services.data;
        this.loadingServices = false;  // Hide the loading spinner when the API call finishes
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
    this.serviceRateService.getServiceRates(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.service_rates = result.service_rates.data;// Set the items
      this.totalItems = result.service_rates.total; // Total number of items
      this.perPage = result.service_rates.per_page; // Items per page
      this.currentPage = result.service_rates.current_page; // Set the current page
      this.toItems = result.service_rates.to; // Set to Items
      this.fromItems = result.service_rates.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, serviceRate: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (serviceRate != null) {
      this.serviceRateForm.get("id").setValue(serviceRate.id);
      this.serviceRateForm.get("amount").setValue(serviceRate.amount);
        this.services.push(serviceRate.service);
        this.selectedServiceOption = serviceRate.service_id;
        this.sub_types.push(serviceRate.sub_type);
        this.selectedSubTypeOption = serviceRate.sub_type_id;
      this.serviceRateForm.get("status").setValue(serviceRate.status);
    } else {
      this.serviceRateForm.get("id").setValue(0);
      this.serviceRateForm.get("amount").setValue("");
      this.selectedServiceOption = null;
      this.selectedSubTypeOption = null;
      this.serviceRateForm.get("status").setValue("1");
    }
  }
  addLocation() {
    if (this.serviceRateForm.valid) {
      this.isLoading = true;
      this.serviceRateService.updateServiceRate(this.serviceRateForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.service) {
          this.toastr.error(error?.error?.errors?.service);
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
