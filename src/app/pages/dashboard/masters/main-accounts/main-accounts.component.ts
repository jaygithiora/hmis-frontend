import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { BloodGroupsService } from '@services/dashboard/masters/blood-groups/blood-groups.service';
import { MainAccountsService } from '@services/dashboard/masters/main-accounts/main-accounts.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-accounts',
  templateUrl: './main-accounts.component.html',
  styleUrl: './main-accounts.component.scss'
})
export class MainAccountsComponent  implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  mainAccountForm!: FormGroup;

  main_accounts: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private mainAccountService: MainAccountsService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.mainAccountForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = false;
    this.mainAccountService.getMainAccounts(page).subscribe((result: any) => {
      this.isLoading = false;
      this.main_accounts = result.main_accounts.data;// Set the items
      this.totalItems = result.main_accounts.total; // Total number of items
      this.perPage = result.main_accounts.per_page; // Items per page
      this.currentPage = result.main_accounts.current_page; // Set the current page
      this.toItems = result.main_accounts.to; // Set to Items
      this.fromItems = result.main_accounts.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, blood_group: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (blood_group != null) {
      this.mainAccountForm.get("id").setValue(blood_group.id);
      this.mainAccountForm.get("name").setValue(blood_group.name);
      this.mainAccountForm.get("status").setValue(blood_group.status);
    } else {
      this.mainAccountForm.get("id").setValue(0);
      this.mainAccountForm.get("name").setValue("");
      this.mainAccountForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.mainAccountForm.valid) {
      this.isLoading = true;
      this.mainAccountService.updateMainAccount(this.mainAccountForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if(error?.error?.errors?.id){
          this.toastr.error(error?.error?.errors?.id);
        }
        if(error?.error?.errors?.name){
          this.toastr.error(error?.error?.errors?.name);
        }
        if(error?.error?.errors?.status){
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
