import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { SickLeaveTypesService } from '@services/dashboard/settings/sick-leave-types/sick-leave-types.service';
import { SocialHistoriesService } from '@services/dashboard/settings/social-histories/social-histories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sick-leave-types',
  templateUrl: './sick-leave-types.component.html',
  styleUrl: './sick-leave-types.component.scss'
})
export class SickLeaveTypesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  sickLeaveTypeForm!: FormGroup;

  sick_leave_types: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private sickLeaveTypesService: SickLeaveTypesService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.sickLeaveTypeForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.sickLeaveTypesService.getSickLeaveTypes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.sick_leave_types = result.sick_leave_types.data;// Set the items
      this.totalItems = result.sick_leave_types.total; // Total number of items
      this.perPage = result.sick_leave_types.per_page; // Items per page
      this.currentPage = result.sick_leave_types.current_page; // Set the current page
      this.toItems = result.sick_leave_types.to; // Set to Items
      this.fromItems = result.sick_leave_types.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, sick_leave_type: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (sick_leave_type != null) {
      this.sickLeaveTypeForm.get("id").setValue(sick_leave_type.id);
      this.sickLeaveTypeForm.get("name").setValue(sick_leave_type.name);
    } else {
      this.sickLeaveTypeForm.get("id").setValue(0);
      this.sickLeaveTypeForm.get("name").setValue("");
    }
  }

  addSickLeaveType() {
    if (this.sickLeaveTypeForm.valid) {
      this.isLoading = true;
      this.sickLeaveTypesService.updateSickLeaveType(this.sickLeaveTypeForm.getRawValue()).subscribe((result: any) => {
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
  
  removeSickLeaveType(id:any) {
    if (id) {
      this.isLoading = true;
      this.sickLeaveTypesService.deleteSickLeaveType({id:id}).subscribe((result: any) => {
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
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
          this.modalRef?.close();
        }
        this.isLoading = false;
        console.log(error);
      });
    } else {
      this.toastr.error("Invalid Sick Leave Type Id!");
    }
  }
  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}




