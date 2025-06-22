import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { IcdsService } from '@services/dashboard/masters/icds/icds.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-icds',
  templateUrl: './icds.component.html',
  styleUrl: './icds.component.scss'
})
export class IcdsComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  icdForm!: FormGroup;

  icds: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private icdService: IcdsService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.icdForm = this.fb.group({
      id: ['0', [Validators.required]],
      icd_name: ['', [Validators.required]],
      icd_code: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.icdService.getICDs(page).subscribe((result: any) => {
      this.isLoading = false;
      this.icds = result.icds.data;// Set the items
      this.totalItems = result.icds.total; // Total number of items
      this.perPage = result.icds.per_page; // Items per page
      this.currentPage = result.icds.current_page; // Set the current page
      this.toItems = result.icds.to; // Set to Items
      this.fromItems = result.icds.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, icd: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (icd != null) {
      this.icdForm.get("id").setValue(icd.id);
      this.icdForm.get("icd_name").setValue(icd.name);
      this.icdForm.get("icd_code").setValue(icd.code);
      this.icdForm.get("status").setValue(icd.status);
    } else {
      this.icdForm.get("id").setValue(0);
      this.icdForm.get("icd_name").setValue("");
      this.icdForm.get("icd_code").setValue("");
      this.icdForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.icdForm.valid) {
      this.isLoading = true;
      this.icdService.updateICD(this.icdForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.icd_code) {
          this.toastr.error(error?.error?.errors?.icd_code);
        }
        if (error?.error?.errors?.icd_name) {
          this.toastr.error(error?.error?.errors?.icd_name);
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
