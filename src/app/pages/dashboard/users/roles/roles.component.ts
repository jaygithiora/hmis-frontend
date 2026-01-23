import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { RolesService } from '@services/dashboard/users/roles.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {
  private modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  rolesForm!: FormGroup;

  roles: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private rolesService: RolesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.rolesForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      can_self_register: ['1', [Validators.required]]
    });
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.rolesService.getRoles(page).subscribe((result: any) => {
      this.isLoading = false;
      this.roles = result.roles.data;// Set the items
      this.totalItems = result.roles.total; // Total number of items
      this.perPage = result.roles.per_page; // Items per page
      this.currentPage = result.roles.current_page; // Set the current page
      this.toItems = result.roles.to; // Set to Items
      this.fromItems = result.roles.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, role: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (role != null) {
      this.rolesForm.get("id").setValue(role.id);
      this.rolesForm.get("name").setValue(role.name);
      this.rolesForm.get("can_self_register").setValue(role.can_self_register);
      //this.main_types.push(user.main_type);
      //this.selectedOption = user.main_type_id;
      //this.rolesForm.get("status").setValue(user.status);
    } else {
      this.rolesForm.get("id").setValue(0);
      this.rolesForm.get("name").setValue("");
      this.rolesForm.get("can_self_register").setValue("1");
      //this.selectedOption = null;
    }
  }
  addRole() {
    if (this.rolesForm.valid) {
      this.isLoading = true;
      this.rolesService.updateRole(this.rolesForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.can_self_register) {
          this.toastr.error(error?.error?.errors?.can_self_register);
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
      this.rolesForm.markAllAsTouched();
      //this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
