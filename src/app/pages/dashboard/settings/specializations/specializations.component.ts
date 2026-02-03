import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { SpecializationsService } from '@services/dashboard/settings/specializations/specializations.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-specializations',
  templateUrl: './specializations.component.html',
  styleUrl: './specializations.component.scss'
})
export class SpecializationsComponent  implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  specializationForm!: FormGroup;

  specializations: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private specializationsService: SpecializationsService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.specializationForm = this.fb.group({
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
    this.specializationsService.getSpecializations(page).subscribe((result: any) => {
      this.isLoading = false;
      this.specializations = result.specializations.data;// Set the items
      this.totalItems = result.specializations.total; // Total number of items
      this.perPage = result.specializations.per_page; // Items per page
      this.currentPage = result.specializations.current_page; // Set the current page
      this.toItems = result.specializations.to; // Set to Items
      this.fromItems = result.specializations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, specialization: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (specialization != null) {
      this.specializationForm.get("id").setValue(specialization.id);
      this.specializationForm.get("name").setValue(specialization.name);
      this.specializationForm.get("description").setValue(specialization.description);
    } else {
      this.specializationForm.get("id").setValue(0);
      this.specializationForm.get("name").setValue("");
      this.specializationForm.get("description").setValue("");
    }
  }

  addSpecialization() {
    if (this.specializationForm.valid) {
      this.isLoading = true;
      this.specializationsService.updateSpecialization(this.specializationForm.getRawValue()).subscribe((result: any) => {
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
      this.specializationForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }
  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}



