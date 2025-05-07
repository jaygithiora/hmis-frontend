import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { InventoryCategoriesService } from '@services/dashboard/inventory/inventory-categories/inventory-categories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-inventory-categories',
  templateUrl: './inventory-categories.component.html',
  styleUrl: './inventory-categories.component.scss'
})
export class InventoryCategoriesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  inventoryCategoryForm!: FormGroup;

  inventory_categories: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private inventoryCategoriesService: InventoryCategoriesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.inventoryCategoryForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['bbbb'],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.inventoryCategoriesService.getInventoryCategories(page).subscribe((result: any) => {
      this.isLoading = false;
      this.inventory_categories = result.inventory_categories.data;// Set the items
      this.totalItems = result.inventory_categories.total; // Total number of items
      this.perPage = result.inventory_categories.per_page; // Items per page
      this.currentPage = result.inventory_categories.current_page; // Set the current page
      this.toItems = result.inventory_categories.to; // Set to Items
      this.fromItems = result.inventory_categories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, location: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (location != null) {
      this.inventoryCategoryForm.get("id").setValue(location.id);
      this.inventoryCategoryForm.get("name").setValue(location.name);
      this.inventoryCategoryForm.get("status").setValue(location.status);
    } else {
      this.inventoryCategoryForm.get("id").setValue(0);
      this.inventoryCategoryForm.get("name").setValue("");
      this.inventoryCategoryForm.get("status").setValue(1);
    }
  }
  addInventoryCategory() {
    if (this.inventoryCategoryForm.valid) {
      this.isLoading = true;
      this.inventoryCategoriesService.updateInventoryCategories(this.inventoryCategoryForm.getRawValue()).subscribe((result: any) => {

        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if(error?.error?.errors?.code){
          this.toastr.error(error?.error?.errors?.code);
        }
        if(error?.error?.errors?.name){
          this.toastr.error(error?.error?.errors?.name);
        }
        if(error?.error?.errors?.code){
          this.toastr.error(error?.error?.errors?.code);
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
