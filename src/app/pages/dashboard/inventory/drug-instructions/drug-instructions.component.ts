import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DrugInstructionsService } from '@services/dashboard/inventory/drug-instructions/drug-instructions.service';
import { PurchaseTypesService } from '@services/dashboard/inventory/purchase-types/purchase-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drug-instructions',
  templateUrl: './drug-instructions.component.html',
  styleUrl: './drug-instructions.component.scss'
})
export class DrugInstructionsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  drugInstructionsForm!: FormGroup;

  drug_instructions: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private drugInstructionsService: DrugInstructionsService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.drugInstructionsForm = this.fb.group({
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
    this.drugInstructionsService.getDrugInstructions(page).subscribe((result: any) => {
      this.isLoading = false;
      this.drug_instructions = result.drug_instructions.data;// Set the items
      this.totalItems = result.drug_instructions.total; // Total number of items
      this.perPage = result.drug_instructions.per_page; // Items per page
      this.currentPage = result.drug_instructions.current_page; // Set the current page
      this.toItems = result.drug_instructions.to; // Set to Items
      this.fromItems = result.drug_instructions.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, location: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (location != null) {
      this.drugInstructionsForm.get("id").setValue(location.id);
      this.drugInstructionsForm.get("name").setValue(location.name);
      this.drugInstructionsForm.get("status").setValue(location.status);
    } else {
      this.drugInstructionsForm.get("id").setValue(0);
      this.drugInstructionsForm.get("name").setValue("");
      this.drugInstructionsForm.get("status").setValue(1);
    }
  }
  addInventoryCategory() {
    if (this.drugInstructionsForm.valid) {
      this.isLoading = true;
      this.drugInstructionsService.updateDrugInstructions(this.drugInstructionsForm.getRawValue()).subscribe((result: any) => {

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
