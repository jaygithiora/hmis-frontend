import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ProductsService } from '@services/dashboard/inventory/products/products.service';
import { LaboratoryTestsService } from '@services/dashboard/laboratory/laboratory-tests/laboratory-tests.service';
import { SchemeExclusionsService } from '@services/dashboard/masters/insurances/scheme-exclusions/scheme-exclusions.service';
import { SchemesService } from '@services/dashboard/masters/insurances/schemes/schemes.service';
import { RadiologyItemsService } from '@services/dashboard/radiology/radiology-items/radiology-items.service';
import { ServicesService } from '@services/dashboard/services/services/services.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-scheme-exclusions',
  templateUrl: './scheme-exclusions.component.html',
  styleUrl: './scheme-exclusions.component.scss'
})
export class SchemeExclusionsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  loadingSchemes: boolean = false;
  loadingProducts: boolean = false;
  loadingServices: boolean = false;
  loadingLaboratoryTests: boolean = false;
  loadingRadiologyItems: boolean = false;

  triage_item: any;

  schemeExclusionForm!: FormGroup;

  scheme_exclusions: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  schemes: any[] = [];
  selectedScheme: any;
  searchSchemes$ = new Subject<string>();

  products: any[] = [];
  selectedProduct: any;
  searchProducts$ = new Subject<string>();

  services: any[] = [];
  selectedService: any;
  searchService$ = new Subject<string>();

  radiology_items: any[] = [];
  selectedRadiologyItem: any;
  searchRadiologyItem$ = new Subject<string>();

  laboratory_tests: any[] = [];
  selectedLaboratoryTest: any;
  searchLaboratoryTest$ = new Subject<string>();

  active = 1;

  constructor(private schemesService: SchemesService, private laboratoryTestService: LaboratoryTestsService, private radiologyItemService: RadiologyItemsService,
    private productService: ProductsService, private servicesService: ServicesService, private schemeExclusionService: SchemeExclusionsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,
  ) {

    this.schemeExclusionForm = this.fb.group({
      id: ['0', [Validators.required]],
      service: [null],
      product: [null],
      laboratory_test: [null],
      radiology_item: [null],
      scheme: [null, [Validators.required]]
    });
    this.loadOptions();
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadOptions() {
    this.searchSchemes$.pipe(
      debounceTime(300),
      tap(() => this.loadingSchemes = true),
      switchMap(term => this.schemesService.getSchemes(1, term)),
      tap(() => this.loadingSchemes= false)
    ).subscribe(data => {
      this.schemes = data.schemes.data;
    });

    this.searchProducts$.pipe(
      debounceTime(300),
      tap(() => this.loadingProducts = true),
      switchMap(term => this.productService.getProducts(1, term)),
      tap(() => this.loadingProducts = false)
    ).subscribe(data => {
      this.products = data.products.data;
    });

    this.searchService$.pipe(
      debounceTime(300),
      tap(() => this.loadingServices = true),
      switchMap(term => this.servicesService.getServices(1, term)),
      tap(() => this.loadingServices = false)
    ).subscribe(data => {
      this.services = data.services.data;
    });

    this.searchLaboratoryTest$.pipe(
      debounceTime(300),
      tap(() => this.loadingLaboratoryTests = true),
      switchMap(term => this.laboratoryTestService.getLaboratoryTests(1, term)),
      tap(() => this.loadingLaboratoryTests = false)
    ).subscribe(data => {
      this.laboratory_tests = data.laboratory_tests.data;
    });

    this.searchLaboratoryTest$.pipe(
      debounceTime(300),
      tap(() => this.loadingLaboratoryTests = true),
      switchMap(term => this.laboratoryTestService.getLaboratoryTests(1, term)),
      tap(() => this.loadingLaboratoryTests = false)
    ).subscribe(data => {
      this.laboratory_tests = data.laboratory_tests.data;
    });

    this.searchRadiologyItem$.pipe(
      debounceTime(300),
      tap(() => this.loadingRadiologyItems = true),
      switchMap(term => this.radiologyItemService.getRadiologyItems(1, term)),
      tap(() => this.loadingRadiologyItems = false)
    ).subscribe(data => {
      this.radiology_items = data.radiology_items.data;
    });
  }

  onItemSelect(event: any) {
    console.log("event", event);
  }
  onTabChange(event: any) {
    console.log("tab change event", event);
      this.selectedLaboratoryTest = null;
      //this.selectedScheme = null;
      this.selectedRadiologyItem = null;
      this.selectedService = null;
      this.selectedProduct = null;
  }


  loadPage(page: number): void {
    this.isLoading = true;
    this.schemeExclusionService.getSchemeExclusions(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.scheme_exclusions = result.scheme_exclusions.data;// Set the items
      this.totalItems = result.scheme_exclusions.total; // Total number of items
      this.perPage = result.scheme_exclusions.per_page; // Items per page
      this.currentPage = result.scheme_exclusions.current_page; // Set the current page
      this.toItems = result.scheme_exclusions.to; // Set to Items
      this.fromItems = result.scheme_exclusions.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }


  openModal(content: TemplateRef<any>, schemeExclusion: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (schemeExclusion != null) {
      this.schemeExclusionForm.get("id").setValue(schemeExclusion.id);
      if (schemeExclusion.laboratory_test) {
        this.active = 1;
        this.selectedLaboratoryTest = schemeExclusion.laboratory_test_id;
        this.laboratory_tests = [];
        this.laboratory_tests.push(schemeExclusion.laboratory_test)
      }
      if (schemeExclusion.scheme) {
        this.selectedScheme = schemeExclusion.scheme_id;
        this.schemes = [];
        this.schemes.push(schemeExclusion.scheme)
      }
      if (schemeExclusion.product) {
        this.active = 4;
        this.selectedProduct = schemeExclusion.product_id;
        this.products = [];
        this.products.push(schemeExclusion.product)
      }
      if (schemeExclusion.service) {
        this.active = 3;
        this.selectedService = schemeExclusion.service_id;
        this.services = [];
        this.services.push(schemeExclusion.service)
      }
      if (schemeExclusion.radiology_item) {
        this.active = 2;
        this.selectedRadiologyItem = schemeExclusion.radiology_item_id;
        this.radiology_items = [];
        this.radiology_items.push(schemeExclusion.radiology_item)
      }
    } else {
      this.schemeExclusionForm.get("id").setValue(0);
      this.selectedLaboratoryTest = null;
      this.selectedScheme = null;
      this.selectedRadiologyItem = null;
      this.selectedService = null;
      this.selectedProduct = null;
    }
  }
  addSchemeExclusion() {
    if (this.schemeExclusionForm.valid) {
      console.log(this.schemeExclusionForm.getRawValue());
      this.isLoading = true;
      this.schemeExclusionService.updateSchemeExclusion(this.schemeExclusionForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
        this.loadPage(1);
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.product) {
          this.toastr.error(error?.error?.errors?.product);
        }
        if (error?.error?.errors?.scheme) {
          this.toastr.error(error?.error?.errors?.scheme);
        }
        if (error?.error?.errors?.radiology_item) {
          this.toastr.error(error?.error?.errors?.radiology_item);
        }
        if (error?.error?.errors?.laboratory_test) {
          this.toastr.error(error?.error?.errors?.laboratory_test);
        }
        if (error?.error?.errors?.service) {
          this.toastr.error(error?.error?.errors?.service);
        }
        if (error?.error?.errors?.product) {
          this.toastr.error(error?.error?.errors?.product);
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