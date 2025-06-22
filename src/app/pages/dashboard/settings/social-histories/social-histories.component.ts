import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { SocialHistoriesService } from '@services/dashboard/settings/social-histories/social-histories.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-social-histories',
  templateUrl: './social-histories.component.html',
  styleUrl: './social-histories.component.scss'
})
export class SocialHistoriesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  socialHistoryForm!: FormGroup;

  social_histories: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private socialHistoryService: SocialHistoriesService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.socialHistoryForm = this.fb.group({
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
    this.socialHistoryService.getSocialHistories(page).subscribe((result: any) => {
      this.isLoading = false;
      this.social_histories = result.social_histories.data;// Set the items
      this.totalItems = result.social_histories.total; // Total number of items
      this.perPage = result.social_histories.per_page; // Items per page
      this.currentPage = result.social_histories.current_page; // Set the current page
      this.toItems = result.social_histories.to; // Set to Items
      this.fromItems = result.social_histories.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, systems: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (systems != null) {
      this.socialHistoryForm.get("id").setValue(systems.id);
      this.socialHistoryForm.get("name").setValue(systems.name);
      this.socialHistoryForm.get("description").setValue(systems.description);
      this.socialHistoryForm.get("status").setValue(systems.status);
    } else {
      this.socialHistoryForm.get("id").setValue(0);
      this.socialHistoryForm.get("name").setValue("");
      this.socialHistoryForm.get("description").setValue("");
      this.socialHistoryForm.get("status").setValue(1);
    }
  }

  addSocialHistory() {
    if (this.socialHistoryForm.valid) {
      this.isLoading = true;
      this.socialHistoryService.updateSocialHistory(this.socialHistoryForm.getRawValue()).subscribe((result: any) => {
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



