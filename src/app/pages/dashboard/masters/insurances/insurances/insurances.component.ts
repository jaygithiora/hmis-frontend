import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { InsurancesService } from '@services/dashboard/masters/insurances/insurances/insurances.service';
import { PaymentTypesService } from '@services/dashboard/masters/payments/payment-types/payment-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-insurances',
  templateUrl: './insurances.component.html',
  styleUrl: './insurances.component.scss'
})
export class InsurancesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  searchControl = new FormControl('');

  insuranceForm!: FormGroup;

  payment_types: any[] = [];// Store fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  insurances: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private insurancesService: InsurancesService, private paymentTypesService: PaymentTypesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.insuranceForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      payment_type: [null, [Validators.required]],
    });
    this.setupSearch();
  }

  setupSearch() {
    this.search$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loading = true),  // Show the loading spinner
        switchMap(term => this.paymentTypesService.getPaymentTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.payment_types = results.payment_types.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
  }
  // Handle item selection
  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }
  ngOnInit() {
    this.loadPage(1);
    this.searchControl.valueChanges.pipe(
    debounceTime(400),              // wait 400ms after typing stops
    distinctUntilChanged(),         // only if value changed
    tap(() => this.isLoading = true), // show spinner
    switchMap(term => 
      this.insurancesService.getInsurances(1,term)   // call API
    )
  ).subscribe(result => {
    //this.results = response;
    this.isLoading = false;
      this.insurances = result.insurances.data;// Set the items
      this.totalItems = result.insurances.total; // Total number of items
      this.perPage = result.insurances.per_page; // Items per page
      this.currentPage = result.insurances.current_page; // Set the current page
      this.toItems = result.insurances.to; // Set to Items
      this.fromItems = result.insurances.from; // Set from Items
  });
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.insurancesService.getInsurances(page).subscribe((result: any) => {
      this.isLoading = false;
      this.insurances = result.insurances.data;// Set the items
      this.totalItems = result.insurances.total; // Total number of items
      this.perPage = result.insurances.per_page; // Items per page
      this.currentPage = result.insurances.current_page; // Set the current page
      this.toItems = result.insurances.to; // Set to Items
      this.fromItems = result.insurances.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, insurance: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (insurance != null) {
      this.payment_types = [];
      this.insuranceForm.get("id").setValue(insurance.id);
      this.insuranceForm.get("name").setValue(insurance.name);
      this.insuranceForm.get("description").setValue(insurance.description);
      const exists = this.payment_types.some(
        (p: any) => p.id === insurance.payment_type.id
      );

      if (!exists) {
        this.payment_types.push(insurance.payment_type);
      }
      this.selectedOption = insurance.payment_type_id;
    } else {
      this.insuranceForm.get("id").setValue(0);
      this.insuranceForm.get("name").setValue("");
      this.insuranceForm.get("description").setValue("");
      this.selectedOption = null;
    }
  }
  addInsurance() {
    if (this.insuranceForm.valid) {
      this.isLoading = true;
      this.insurancesService.updateInsurance(this.insuranceForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.payment_type) {
          this.toastr.error(error?.error?.errors?.payment_type);
        }
        if (error?.error?.errors?.description) {
          this.toastr.error(error?.error?.errors?.description);
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
      this.insuranceForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

