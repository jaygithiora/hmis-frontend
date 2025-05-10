import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { BedChargeSettingsService } from '@services/dashboard/ip-masters/bed-charge-settings/bed-charge-settings.service';
import { BedChargesService } from '@services/dashboard/ip-masters/bed-charges/bed-charges.service';
import { BedsService } from '@services/dashboard/ip-masters/beds/beds.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-bed-charge-settings',
  templateUrl: './bed-charge-settings.component.html',
  styleUrl: './bed-charge-settings.component.scss'
})
export class BedChargeSettingsComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  bedChargeSettingsForm!: FormGroup;

  bed_charge_settings: any[] = [];// ward fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private bedChargeSettingsService: BedChargeSettingsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.bedChargeSettingsForm = this.fb.group({
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
    this.bedChargeSettingsService.getBedChargeSettings(page).subscribe((result: any) => {
      this.isLoading = false;
      this.bed_charge_settings = result.bed_charge_settings.data;// Set the items
      this.totalItems = result.bed_charge_settings.total; // Total number of items
      this.perPage = result.bed_charge_settings.per_page; // Items per page
      this.currentPage = result.bed_charge_settings.current_page; // Set the current page
      this.toItems = result.bed_charge_settings.to; // Set to Items
      this.fromItems = result.bed_charge_settings.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, bed_charge: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (bed_charge != null) {
      this.bedChargeSettingsForm.get("id").setValue(bed_charge.id);
      this.bedChargeSettingsForm.get("name").setValue(bed_charge.name);
      this.bedChargeSettingsForm.get("status").setValue(bed_charge.status);
    } else {
      this.bedChargeSettingsForm.get("id").setValue(0);
      this.bedChargeSettingsForm.get("name").setValue("");
      this.bedChargeSettingsForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.bedChargeSettingsForm.valid) {
      this.isLoading = true;
      this.bedChargeSettingsService.updateBedChargeSetting(this.bedChargeSettingsForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.status) {
          this.toastr.error(error?.error?.errors?.status);
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


