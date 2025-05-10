import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ProductRatesService } from '@services/dashboard/inventory/product-rates/product-rates.service';
import { ProductsService } from '@services/dashboard/inventory/products/products.service';
import { LaboratoryTestRatesService } from '@services/dashboard/laboratory/laboratory-test-rates/laboratory-test-rates.service';
import { LaboratoryTestsService } from '@services/dashboard/laboratory/laboratory-tests/laboratory-tests.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-laboratory-test-rates',
  templateUrl: './laboratory-test-rates.component.html',
  styleUrl: './laboratory-test-rates.component.scss'
})
export class LaboratoryTestRatesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingLaboratoryTests: boolean = false;
  loadingSubTypes: boolean = false;

  laboratoryTestRateForm!: FormGroup;

laboratory_tests: any[] = [];
  sub_types: any[] = [];

  searchLaboratoryTests$ = new Subject<string>();
  searchSubTypes$ = new Subject<string>();

  selectedLaboratoryTestOption: any;
  selectedSubTypeOption: any;

  laboratory_test_rates: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private laboratoryTestsService: LaboratoryTestsService, private subTypeService: SubTypesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private laboratoryTestRateService: LaboratoryTestRatesService) {
    this.laboratoryTestRateForm = this.fb.group({
      id: ['0', [Validators.required]],
      laboratory_test: ['', [Validators.required]],
      sub_type: ['', [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['1', [Validators.required]]
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchLaboratoryTests$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingLaboratoryTests = true),  // Show the loading spinner
        switchMap(term => this.laboratoryTestsService.getLaboratoryTests(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.laboratory_tests = results.laboratory_tests.data;
        this.loadingLaboratoryTests = false;  // Hide the loading spinner when the API call finishes
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
    this.laboratoryTestRateService.getLaboratoryTestRates(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.laboratory_test_rates = result.laboratory_test_rates.data;// Set the items
      this.totalItems = result.laboratory_test_rates.total; // Total number of items
      this.perPage = result.laboratory_test_rates.per_page; // Items per page
      this.currentPage = result.laboratory_test_rates.current_page; // Set the current page
      this.toItems = result.laboratory_test_rates.to; // Set to Items
      this.fromItems = result.laboratory_test_rates.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, labotatory_test_rate: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (labotatory_test_rate != null) {
      this.laboratoryTestRateForm.get("id").setValue(labotatory_test_rate.id);
      this.laboratoryTestRateForm.get("amount").setValue(labotatory_test_rate.amount);
        this.laboratory_tests.push(labotatory_test_rate.laboratory_test);
        this.selectedLaboratoryTestOption = labotatory_test_rate.laboratory_test_id;
        this.sub_types.push(labotatory_test_rate.sub_type);
        this.selectedSubTypeOption = labotatory_test_rate.sub_type_id;
      this.laboratoryTestRateForm.get("status").setValue(labotatory_test_rate.status);
    } else {
      this.laboratoryTestRateForm.get("id").setValue(0);
      this.laboratoryTestRateForm.get("amount").setValue("");
      this.selectedLaboratoryTestOption = null;
      this.selectedSubTypeOption = null;
      this.laboratoryTestRateForm.get("status").setValue("1");
    }
  }
  addLocation() {
    if (this.laboratoryTestRateForm.valid) {
      this.isLoading = true;
      this.laboratoryTestRateService.updateLaboratoryTestRate(this.laboratoryTestRateForm.getRawValue()).subscribe((result: any) => {
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




