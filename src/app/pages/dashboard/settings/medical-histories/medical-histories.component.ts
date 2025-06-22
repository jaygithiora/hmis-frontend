import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { MedicalHistoriesService } from '@services/dashboard/settings/medical-histories/medical-histories.service';
import { SystemsService } from '@services/dashboard/settings/systems/systems.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-medical-histories',
  templateUrl: './medical-histories.component.html',
  styleUrl: './medical-histories.component.scss'
})
export class MedicalHistoriesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  medicalHistoryForm!: FormGroup;

  medical_histories: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private medicalHistoryService: MedicalHistoriesService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.medicalHistoryForm = this.fb.group({
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
    this.medicalHistoryService.getMedicalHistories(page).subscribe((result: any) => {
      this.isLoading = false;
      this.medical_histories = result.medical_histories.data;// Set the items
      this.totalItems = result.medical_histories.total; // Total number of items
      this.perPage = result.medical_histories.per_page; // Items per page
      this.currentPage = result.medical_histories.current_page; // Set the current page
      this.toItems = result.medical_histories.to; // Set to Items
      this.fromItems = result.medical_histories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, systems: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (systems != null) {
      this.medicalHistoryForm.get("id").setValue(systems.id);
      this.medicalHistoryForm.get("name").setValue(systems.name);
      this.medicalHistoryForm.get("description").setValue(systems.description);
      this.medicalHistoryForm.get("status").setValue(systems.status);
    } else {
      this.medicalHistoryForm.get("id").setValue(0);
      this.medicalHistoryForm.get("name").setValue("");
      this.medicalHistoryForm.get("description").setValue("");
      this.medicalHistoryForm.get("status").setValue(1);
    }
  }

  addMedicalHistory() {
    if (this.medicalHistoryForm.valid) {
      this.isLoading = true;
      this.medicalHistoryService.updateMedicalHistory(this.medicalHistoryForm.getRawValue()).subscribe((result: any) => {
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



