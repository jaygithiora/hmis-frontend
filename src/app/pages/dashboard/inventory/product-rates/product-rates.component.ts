import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ProductRatesService } from '@services/dashboard/inventory/product-rates/product-rates.service';
import { ProductsService } from '@services/dashboard/inventory/products/products.service';
import { SchemesService } from '@services/dashboard/masters/insurances/schemes/schemes.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-rates',
  templateUrl: './product-rates.component.html',
  styleUrl: './product-rates.component.scss'
})
export class ProductRatesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingProducts: boolean = false;
  loadingSchemes: boolean = false;

  productRateForm!: FormGroup;

  products: any[] = [];
  schemes: any[] = [];

  searchProducts$ = new Subject<string>();
  searchSchemes$ = new Subject<string>();

  selectedProductOption: any;
  selectedSchemeOption: any;

  product_rates: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private productsService: ProductsService, private schemesService: SchemesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService, private productRateService: ProductRatesService) {
    this.productRateForm = this.fb.group({
      id: ['0', [Validators.required]],
      product: [null, [Validators.required]],
      scheme: [null, [Validators.required]],
      amount: ['', [Validators.required, Validators.min(0)]],
      status: ['1', [Validators.required]]
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchProducts$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingProducts = true),  // Show the loading spinner
        switchMap(term => this.productsService.getProducts(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.products = results.products.data;
        this.loadingProducts = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchSchemes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingSchemes = true),  // Show the loading spinner
        switchMap(term => this.schemesService.getSchemes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.schemes = results.schemes.data;
        this.loadingSchemes = false;  // Hide the loading spinner when the API call finishes
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
    this.productRateService.getProductRates(page).subscribe((result: any) => {
      //console.log(result);
      this.isLoading = false;
      this.product_rates = result.product_rates.data;// Set the items
      this.totalItems = result.product_rates.total; // Total number of items
      this.perPage = result.product_rates.per_page; // Items per page
      this.currentPage = result.product_rates.current_page; // Set the current page
      this.toItems = result.product_rates.to; // Set to Items
      this.fromItems = result.product_rates.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, product: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (product != null) {
      this.productRateForm.get("id").setValue(product.id);
      this.productRateForm.get("amount").setValue(product.amount);
      if(product?.product){
        this.products = [];
        this.products.push(product.product);
        this.selectedProductOption = product.product_id;
      }
      if(product?.scheme){
        this.schemes = [];
        this.schemes.push(product.scheme);
        this.selectedSchemeOption = product.scheme_id;
      }
      this.productRateForm.get("status").setValue(product.status);
    } else {
      this.productRateForm.get("id").setValue(0);
      this.productRateForm.get("amount").setValue("");
      this.selectedProductOption = null;
      this.selectedSchemeOption = null;
      this.productRateForm.get("status").setValue("1");
    }
  }
  addLocation() {
    if (this.productRateForm.valid) {
      this.isLoading = true;
      this.productRateService.updateProductRate(this.productRateForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.scheme) {
          this.toastr.error(error?.error?.errors?.scheme);
        }
        if (error?.error?.errors?.product) {
          this.toastr.error(error?.error?.errors?.product);
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



