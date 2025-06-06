import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { StatusesService } from '@services/dashboard/settings/statuses/statuses.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-statuses',
  templateUrl: './statuses.component.html',
  styleUrl: './statuses.component.scss'
})
export class StatusesComponent  implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  statusesForm!: FormGroup;

  statuses: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  actions = [{id:"proceed", name: "Proceed"}, {id:"maintain", name:"Maintain"}, {id:"remove", name:"Remove"}];
  selectedOption;

  color: string = '#000000';

  constructor(private statusesService: StatusesService, private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService,
    private router: Router) {
    this.statusesForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      action: ['', [Validators.required]],
      color: [this.color, [Validators.required]],
      active: ['1', [Validators.required]]
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.statusesService.getStatuses(page).subscribe((result: any) => {
      this.isLoading = false;
      this.statuses = result.statuses.data;// Set the items
      this.totalItems = result.statuses.total; // Total number of items
      this.perPage = result.statuses.per_page; // Items per page
      this.currentPage = result.statuses.current_page; // Set the current page
      this.toItems = result.statuses.to; // Set to Items
      this.fromItems = result.statuses.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, status: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (status != null) {
      this.statusesForm.get("id").setValue(status.id);
      this.statusesForm.get("name").setValue(status.name);
      this.color = status.color;
      this.statusesForm.get("actions").setValue(status.action);
      this.statusesForm.get("active").setValue(status.active);
    } else {
      this.statusesForm.get("id").setValue(0);
      this.statusesForm.get("name").setValue("");
      this.statusesForm.get("color").setValue(this.color);
      this.statusesForm.get("action").setValue("proceed");
      this.selectedOption = "proceed";
      this.statusesForm.get("active").setValue(1);
    }
  }
  addStatus() {
    this.statusesForm.get("color").setValue(this.color);
    if (this.statusesForm.valid) {
      this.isLoading = true;
      this.statusesService.updateStatus(this.statusesForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.color) {
          this.toastr.error(error?.error?.errors?.color);
        }
        if (error?.error?.errors?.active) {
          this.toastr.error(error?.error?.errors?.active);
        }
        if (error?.error?.errors?.actions) {
          this.toastr.error(error?.error?.errors?.actions);
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


