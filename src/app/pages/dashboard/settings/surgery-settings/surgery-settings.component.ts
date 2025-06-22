import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { SurgerySettingsService } from '@services/dashboard/settings/surgery-settings/surgery-settings.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-surgery-settings',
  templateUrl: './surgery-settings.component.html',
  styleUrl: './surgery-settings.component.scss'
})
export class SurgerySettingsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  surgerySettingForm!: FormGroup;

  surgeries: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private surgerySettingService: SurgerySettingsService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.surgerySettingForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: ['',],
      status: ['1', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.surgerySettingService.getSurgerySettings(page).subscribe((result: any) => {
      this.isLoading = false;
      this.surgeries = result.surgeries.data;// Set the items
      this.totalItems = result.surgeries.total; // Total number of items
      this.perPage = result.surgeries.per_page; // Items per page
      this.currentPage = result.surgeries.current_page; // Set the current page
      this.toItems = result.surgeries.to; // Set to Items
      this.fromItems = result.surgeries.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, systems: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (systems != null) {
      this.surgerySettingForm.get("id").setValue(systems.id);
      this.surgerySettingForm.get("name").setValue(systems.name);
      this.surgerySettingForm.get("description").setValue(systems.description);
      this.surgerySettingForm.get("status").setValue(systems.status);
    } else {
      this.surgerySettingForm.get("id").setValue(0);
      this.surgerySettingForm.get("name").setValue("");
      this.surgerySettingForm.get("description").setValue("");
      this.surgerySettingForm.get("status").setValue(1);
    }
  }

  addSurgerySetting() {
    if (this.surgerySettingForm.valid) {
      this.isLoading = true;
      this.surgerySettingService.updateSurgerySetting(this.surgerySettingForm.getRawValue()).subscribe((result: any) => {
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



