import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DoseMeasuresService } from '@services/dashboard/inventory/dose-measures/dose-measures.service';
import { DrugInstructionsService } from '@services/dashboard/inventory/drug-instructions/drug-instructions.service';
import { InventoryCategoriesService } from '@services/dashboard/inventory/inventory-categories/inventory-categories.service';
import { PackSizesService } from '@services/dashboard/inventory/pack-sizes/pack-sizes.service';
import { ProductTypesService } from '@services/dashboard/inventory/product-types/product-types.service';
import { ProductsService } from '@services/dashboard/inventory/products/products.service';
import { PurchaseTypesService } from '@services/dashboard/inventory/purchase-types/purchase-types.service';
import { ConsultationTypesService } from '@services/dashboard/masters/consultation-types/consultation-types.service';
import { GenericNameService } from '@services/dashboard/masters/generic-names/generic-name.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingInventoryCategory: boolean = false;
  loadingGenericNames: boolean = false;
  loadingPackSizes: boolean = false;
  loadingPurchaseTypes: boolean = false;
  loadingProductTypes: boolean = false;
  loadingDoseMeasures: boolean = false;
  loadingDrugInstructions: boolean = false;

  productInventoryForm!: FormGroup;

  inventory_categories: any[] = [];
  generic_names: any[] = [];
  pack_sizes: any[] = [];
  purchase_types: any[] = [];
  product_types: any[] = [];
  dose_measures: any[] = [];
  drug_instructions: any[] = [];

  searchInventoryCategories$ = new Subject<string>();
  searchGenericNames$ = new Subject<string>();
  searchPackSizes$ = new Subject<string>();
  searchPurchaseType$ = new Subject<string>();
  searchProductType$ = new Subject<string>();
  searchDoseMeasure$ = new Subject<string>();
  searchDrugInstructions$ = new Subject<string>();

  selectedInventoryCategoryOption: any;
  selectedGenericNameOption: any;
  selectedPackSizeOption: any;
  selectedPurchaseTypeOption: any;
  selectedProductTypeOption: any;
  selectedDoseMeasureOption: any;
  selectedDrugInstructionOption: any;

  products: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private productsService: ProductsService, private inventoryCategoryService: InventoryCategoriesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private packSizeService: PackSizesService,
    private service: AuthService, private genericNameService: GenericNameService, private purchaseTypeService: PurchaseTypesService,
    private productTypeService: ProductTypesService, private doseMeasureService: DoseMeasuresService, private drugInstructionsService: DrugInstructionsService) {
    this.productInventoryForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      inventory_category: ['', [Validators.required]],
      generic_name: ['', [Validators.required]],
      reorder_level: ['', [Validators.required, Validators.min(0)]],
      formula: ['', [Validators.required]],
      volume: [''],
      pack_size: ['', [Validators.required]],
      purchase_type: ['', [Validators.required]],
      product_type: ['', [Validators.required]],
      dose_measure: ['', [Validators.required]],
      drug_instruction: ['', [Validators.required]],
      transfer_type: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchInventoryCategories$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingInventoryCategory = true),  // Show the loading spinner
        switchMap(term => this.inventoryCategoryService.getInventoryCategories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.inventory_categories = results.inventory_categories.data;
        this.loadingInventoryCategory = false;  // Hide the loading spinner when the API call finishes
      });
    this.searchPackSizes$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingPackSizes = true),  // Show the loading spinner
        switchMap(term => this.packSizeService.getPackSizes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe((results: any) => {
        this.pack_sizes = results.pack_sizes.data;
        this.loadingPackSizes = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchGenericNames$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingGenericNames = true),  // Show the loading spinner
        switchMap(term => this.genericNameService.getGenericNames(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.generic_names = results.generic_names.data;
        this.loadingGenericNames = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchPurchaseType$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingPurchaseTypes = true),  // Show the loading spinner
        switchMap(term => this.purchaseTypeService.getPurchaseTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.purchase_types = results.purchase_types.data;
        this.loadingPurchaseTypes = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchProductType$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingProductTypes = true),  // Show the loading spinner
        switchMap(term => this.productTypeService.getProductTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.product_types = results.product_types.data;
        this.loadingProductTypes = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchDoseMeasure$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDoseMeasures = true),  // Show the loading spinner
        switchMap(term => this.doseMeasureService.getDoseMeasures(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.dose_measures = results.dose_measures.data;
        this.loadingDoseMeasures = false;  // Hide the loading spinner when the API call finishes
      });

    this.searchDrugInstructions$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDrugInstructions = true),  // Show the loading spinner
        switchMap(term => this.drugInstructionsService.getDrugInstructions(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.drug_instructions = results.drug_instructions.data;
        this.loadingDrugInstructions = false;  // Hide the loading spinner when the API call finishes
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
    this.productsService.getProducts(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.products = result.products.data;// Set the items
      this.totalItems = result.products.total; // Total number of items
      this.perPage = result.products.per_page; // Items per page
      this.currentPage = result.products.current_page; // Set the current page
      this.toItems = result.products.to; // Set to Items
      this.fromItems = result.products.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, product: any) {
    this.modalRef = this.modalService.open(content, { centered: true, size: 'lg' });
    if (product != null) {
      this.productInventoryForm.get("id").setValue(product.id);
      this.productInventoryForm.get("name").setValue(product.name);
      this.productInventoryForm.get("reorder_level").setValue(product.reorder_level);
      this.productInventoryForm.get("volume").setValue(product.volume);
      this.productInventoryForm.get("transfer_type").setValue(product.transfer_type);
      this.productInventoryForm.get("formula").setValue(product.formula);
      if (product.inventory_category != null) {
        this.inventory_categories.push(product.inventory_category);
        this.selectedInventoryCategoryOption = product.inventory_category_id;
      }
      if (product.generic_name_id != null) {
        this.generic_names.push(product.generic_name);
        this.selectedGenericNameOption = product.generic_name_id;
      }
      if (product.purchase_type_id != null) {
        this.purchase_types.push(product.purchase_type);
        this.selectedPurchaseTypeOption = product.purchase_type_id;
      }
      if (product.pack_size_id != null) {
        this.pack_sizes.push(product.pack_size);
        this.selectedPackSizeOption = product.pack_size_id;
      }
      if (product.purchase_type_id != null) {
        this.product_types.push(product.purchase_type);
        this.selectedProductTypeOption = product.purchase_type_id;
      }
      if (product.dose_measure_id != null) {
        this.dose_measures.push(product.dose_measure);
        this.selectedDoseMeasureOption = product.dose_measure_id;
      }
      if (product.drug_instruction_id != null) {
        this.drug_instructions.push(product.drug_instruction);
        this.selectedDrugInstructionOption = product.drug_instruction_id;
      }
      if (product.product_type_id != null) {
        this.product_types.push(product.product_type);
        this.selectedProductTypeOption = product.product_type_id;
      }
      this.productInventoryForm.get("status").setValue(product.status);
    } else {
      this.productInventoryForm.get("id").setValue(0);
      this.productInventoryForm.get("name").setValue("");
      this.productInventoryForm.get("volume").setValue("");
      this.selectedInventoryCategoryOption = null;
      this.selectedGenericNameOption = null;
      this.selectedPurchaseTypeOption = null;
      this.selectedPackSizeOption = null;
      this.selectedPurchaseTypeOption = null;
      this.selectedProductTypeOption = null;
      this.productInventoryForm.get("transfer_type").setValue("Consumable");
      this.productInventoryForm.get("formula").setValue("Increment");
      this.productInventoryForm.get("status").setValue("1");
    }
  }
  addLocation() {
    if (this.productInventoryForm.valid) {
      this.isLoading = true;
      this.productsService.updateProduct(this.productInventoryForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.generic_name) {
          this.toastr.error(error?.error?.errors?.generic_name);
        }
        if (error?.error?.errors?.inventory_category) {
          this.toastr.error(error?.error?.errors?.inventory_category);
        }
        if (error?.error?.errors?.formula) {
          this.toastr.error(error?.error?.errors?.formula);
        }
        if (error?.error?.errors?.reorder_level) {
          this.toastr.error(error?.error?.errors?.reorder_level);
        }
        if (error?.error?.errors?.pack_size) {
          this.toastr.error(error?.error?.errors?.pack_size);
        }
        if (error?.error?.errors?.volume) {
          this.toastr.error(error?.error?.errors?.volume);
        }
        if (error?.error?.errors?.purchase_type) {
          this.toastr.error(error?.error?.errors?.purchase_type);
        }
        if (error?.error?.errors?.product_type) {
          this.toastr.error(error?.error?.errors?.product_type);
        }
        if (error?.error?.errors?.drug_instruction) {
          this.toastr.error(error?.error?.errors?.drug_instruction);
        }
        if (error?.error?.errors?.dose_measure) {
          this.toastr.error(error?.error?.errors?.dose_measure);
        }
        if (error?.error?.errors?.transfer_type) {
          this.toastr.error(error?.error?.errors?.transfer_type);
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


