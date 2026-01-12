import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { StrengthUnitsService } from '@services/dashboard/inventory/strength-units/strength-units.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-strength-units',
  templateUrl: './strength-units.component.html',
  styleUrl: './strength-units.component.scss'
})
export class StrengthUnitsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  strengthUnitForm!: FormGroup;

  strength_units: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private strengthUnitsService: StrengthUnitsService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.strengthUnitForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.strengthUnitsService.getStrengthUnits(page).subscribe((result: any) => {
      this.isLoading = false;
      this.strength_units = result.strength_units.data;// Set the items
      this.totalItems = result.strength_units.total; // Total number of items
      this.perPage = result.strength_units.per_page; // Items per page
      this.currentPage = result.strength_units.current_page; // Set the current page
      this.toItems = result.strength_units.to; // Set to Items
      this.fromItems = result.strength_units.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, strength_unit: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (strength_unit != null) {
      this.strengthUnitForm.get("id").setValue(strength_unit.id);
      this.strengthUnitForm.get("name").setValue(strength_unit.name);
      this.strengthUnitForm.get("description").setValue(strength_unit.description);
    } else {
      this.strengthUnitForm.get("id").setValue(0);
      this.strengthUnitForm.get("name").setValue("");
      this.strengthUnitForm.get("description").setValue("");
    }
  }

  addStrengthUnit() {
    if (this.strengthUnitForm.valid) {
      this.isLoading = true;
      this.strengthUnitsService.updateStrengthUnit(this.strengthUnitForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.description) {
          this.toastr.error(error?.error?.errors?.description);
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
