import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { PackSizesService } from '@services/dashboard/inventory/pack-sizes/pack-sizes.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-pack-sizes',
  templateUrl: './pack-sizes.component.html',
  styleUrl: './pack-sizes.component.scss'
})
export class PackSizesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  packSizeForm!: FormGroup;

  pack_sizes: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private packSizesService: PackSizesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.packSizeForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      items: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.packSizesService.getPackSizes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.pack_sizes = result.pack_sizes.data;// Set the items
      this.totalItems = result.pack_sizes.total; // Total number of items
      this.perPage = result.pack_sizes.per_page; // Items per page
      this.currentPage = result.pack_sizes.current_page; // Set the current page
      this.toItems = result.pack_sizes.to; // Set to Items
      this.fromItems = result.pack_sizes.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, location: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (location != null) {
      this.packSizeForm.get("id").setValue(location.id);
      this.packSizeForm.get("name").setValue(location.name);
      this.packSizeForm.get("items").setValue(location.items);
      this.packSizeForm.get("status").setValue(location.status);
    } else {
      this.packSizeForm.get("id").setValue(0);
      this.packSizeForm.get("name").setValue("");
      this.packSizeForm.get("items").setValue("");
      this.packSizeForm.get("status").setValue(1);
    }
  }
  addInventoryCategory() {
    if (this.packSizeForm.valid) {
      this.isLoading = true;
      this.packSizesService.updatePackSize(this.packSizeForm.getRawValue()).subscribe((result: any) => {

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
        if(error?.error?.errors?.items){
          this.toastr.error(error?.error?.errors?.items);
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

