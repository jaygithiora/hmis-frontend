import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { PurchaseTypesService } from '@services/dashboard/inventory/purchase-types/purchase-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-purchase-types',
  templateUrl: './purchase-types.component.html',
  styleUrl: './purchase-types.component.scss'
})
export class PurchaseTypesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  purchaseTypeForm!: FormGroup;

  purchase_types: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private purchaseTypeService: PurchaseTypesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.purchaseTypeForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.purchaseTypeService.getPurchaseTypes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.purchase_types = result.purchase_types.data;// Set the items
      this.totalItems = result.purchase_types.total; // Total number of items
      this.perPage = result.purchase_types.per_page; // Items per page
      this.currentPage = result.purchase_types.current_page; // Set the current page
      this.toItems = result.purchase_types.to; // Set to Items
      this.fromItems = result.purchase_types.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, location: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (location != null) {
      this.purchaseTypeForm.get("id").setValue(location.id);
      this.purchaseTypeForm.get("name").setValue(location.name);
      this.purchaseTypeForm.get("status").setValue(location.status);
    } else {
      this.purchaseTypeForm.get("id").setValue(0);
      this.purchaseTypeForm.get("name").setValue("");
      this.purchaseTypeForm.get("status").setValue(1);
    }
  }
  addInventoryCategory() {
    if (this.purchaseTypeForm.valid) {
      this.isLoading = true;
      this.purchaseTypeService.updatePurchaseType(this.purchaseTypeForm.getRawValue()).subscribe((result: any) => {

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