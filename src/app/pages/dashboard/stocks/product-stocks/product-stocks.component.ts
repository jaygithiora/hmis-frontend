import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ProductsService } from '@services/dashboard/inventory/products/products.service';
import { StrengthUnitsService } from '@services/dashboard/inventory/strength-units/strength-units.service';
import { LocationsService } from '@services/dashboard/masters/locations.service';
import { StoresService } from '@services/dashboard/masters/stores/stores.service';
import { ProductStocksService } from '@services/dashboard/stocks/product-stocks/product-stocks.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-product-stocks',
  templateUrl: './product-stocks.component.html',
  styleUrl: './product-stocks.component.scss'
})
export class ProductStocksComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingLocations: boolean = false;
  loadingStores: boolean = false;
  loadingProducts: boolean = false;
  loadingStrengthUnits: boolean = false;

  productStockForm!: FormGroup;

  locations: any[] = [];
  stores: any[] = [];
  products: any[] = [];
  strength_units: any[] = [];

  searchProducts$ = new Subject<string>();
  searchLocations$ = new Subject<string>();
  searchStores$ = new Subject<string>();
  searchStrengthUnit$ = new Subject<string>();

  selectedProductOption: any;
  selectedLocationsOption: any;
  selectedStoresOption: any;
  selectedStrengthUnitOption: any;

  product_stocks: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private productsService: ProductsService, private productStockService: ProductStocksService, private locationsService: LocationsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private storesService: StoresService,
    private service: AuthService, private strengthUnitsService:StrengthUnitsService) {
    this.productStockForm = this.fb.group({
      id: ['0', [Validators.required]],
      quantity: ['', [Validators.required,Validators.min(1),Validators.pattern(/^[1-9]\d*$/)]],
      strength: ['', [Validators.required,Validators.min(1),Validators.pattern(/^[1-9]\d*$/)]],
      cost: ['', [Validators.required,Validators.min(1),Validators.pattern(/^[1-9]\d*$/)]],
      selling: ['', [Validators.required,Validators.min(1),Validators.pattern(/^[1-9]\d*$/)]],
      product: ['', [Validators.required]],
      location: ['', [Validators.required]],
      store: ['', [Validators.required]],
      strength_unit: ['', [Validators.required]],
      expiry_date: [''],
      batch: [''],
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
    this.searchLocations$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingLocations = true),  // Show the loading spinner
        switchMap(term => this.locationsService.getLocations(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.locations = results.locations.data;
        this.loadingLocations = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchStores$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingStores = true),  // Show the loading spinner
        switchMap(term => this.storesService.getStores(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.stores = results.stores.data;
        this.loadingStores = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchStrengthUnit$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingStrengthUnits = true),  // Show the loading spinner
        switchMap(term => this.strengthUnitsService.getStrengthUnits(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.strength_units = results.strength_units.data;
        this.loadingStrengthUnits = false;  // Hide the loading spinner when the API call finishes
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
    this.productStockService.getStocks(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.product_stocks = result.stocks.data;// Set the items
      this.totalItems = result.stocks.total; // Total number of items
      this.perPage = result.stocks.per_page; // Items per page
      this.currentPage = result.stocks.current_page; // Set the current page
      this.toItems = result.stocks.to; // Set to Items
      this.fromItems = result.stocks.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, product: any) {
    this.modalRef = this.modalService.open(content, { centered: true, size: 'md' });
    if (product != null) {
      this.productStockForm.get("id").setValue(product.id);
      this.productStockForm.get("quantity").setValue(product.quantity);
      this.productStockForm.get("strength").setValue(product.strength);
      this.productStockForm.get("batch").setValue(product.batch);
      this.productStockForm.get("expiry_date").setValue(product.expiry_date);
      this.productStockForm.get("cost").setValue(product.cost);
      this.productStockForm.get("selling").setValue(product.selling);
      if (product.product != null) {
        this.products.push(product.product);
        this.selectedProductOption = product.product_id;
      }
      if (product.location != null) {
        this.locations.push(product.location);
        this.selectedLocationsOption = product.location_id;
      }
      if (product.store != null) {
        this.products.push(product.store);
        this.selectedStoresOption = product.store_id;
      }
    } else {
      this.productStockForm.get("id").setValue(0);
      this.productStockForm.get("batch").setValue("");
      this.productStockForm.get("expiry_date").setValue("");
      this.productStockForm.get("quantity").setValue("");
      this.productStockForm.get("strength").setValue("");
      this.productStockForm.get("cost").setValue("");
      this.productStockForm.get("selling").setValue("");
      this.selectedProductOption = null;
      this.selectedLocationsOption = null;
      this.selectedStoresOption = null;
    }
  }
  addProductStock() {
    if (this.productStockForm.valid) {
      this.isLoading = true;
      this.productStockService.updateStock(this.productStockForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.batch) {
          this.toastr.error(error?.error?.errors?.batch);
        }
        if (error?.error?.errors?.expiry_date) {
          this.toastr.error(error?.error?.errors?.expiry_date);
        }
        if (error?.error?.errors?.product) {
          this.toastr.error(error?.error?.errors?.product);
        }
        if (error?.error?.errors?.location) {
          this.toastr.error(error?.error?.errors?.location);
        }
        if (error?.error?.errors?.store) {
          this.toastr.error(error?.error?.errors?.store);
        }
        if (error?.error?.errors?.quantity) {
          this.toastr.error(error?.error?.errors?.quantity);
        }
        if (error?.error?.errors?.strength) {
          this.toastr.error(error?.error?.errors?.strength);
        }
        if (error?.error?.errors?.strength_unit) {
          this.toastr.error(error?.error?.errors?.strength_unit);
        }
        if (error?.error?.errors?.selling) {
          this.toastr.error(error?.error?.errors?.selling);
        }
        if (error?.error?.errors?.cost) {
          this.toastr.error(error?.error?.errors?.cost);
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


