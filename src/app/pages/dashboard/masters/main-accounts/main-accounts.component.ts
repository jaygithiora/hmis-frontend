import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { BloodGroupsService } from '@services/dashboard/masters/blood-groups/blood-groups.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-accounts',
  templateUrl: './main-accounts.component.html',
  styleUrl: './main-accounts.component.scss'
})
export class MainAccountsComponent  implements OnInit {
  public isLoading: boolean = true;
  bloodGroupForm!: FormGroup;

  blood_groups: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private bloodGroupService: BloodGroupsService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.bloodGroupForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.bloodGroupService.getBloodGroups(page).subscribe((result: any) => {
      this.isLoading = false;
      this.blood_groups = result.blood_groups.data;// Set the items
      this.totalItems = result.blood_groups.total; // Total number of items
      this.perPage = result.blood_groups.per_page; // Items per page
      this.currentPage = result.blood_groups.current_page; // Set the current page
      this.toItems = result.blood_groups.to; // Set to Items
      this.fromItems = result.blood_groups.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, blood_group: any) {
    this.modalService.open(content, { centered: true });
    if (blood_group != null) {
      this.bloodGroupForm.get("id").setValue(blood_group.id);
      this.bloodGroupForm.get("name").setValue(blood_group.name);
      this.bloodGroupForm.get("description").setValue(blood_group.description);
      this.bloodGroupForm.get("status").setValue(blood_group.status);
    } else {
      this.bloodGroupForm.get("id").setValue(0);
      this.bloodGroupForm.get("name").setValue("");
      this.bloodGroupForm.get("description").setValue("");
      this.bloodGroupForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.bloodGroupForm.valid) {
      this.isLoading = true;
      this.bloodGroupService.updateBloodGroups(this.bloodGroupForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
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
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
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
