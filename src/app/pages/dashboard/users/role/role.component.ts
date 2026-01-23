import { ChangeDetectorRef, Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { RolesService } from '@services/dashboard/users/roles.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrl: './role.component.scss'
})
export class RoleComponent implements OnInit {
  private modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  permissionsForm!: FormGroup;

  role: any;
  permissions: any[] = [];

  constructor(private rolesService: RolesService, private route: ActivatedRoute,
    private cd: ChangeDetectorRef,private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
      this.permissionsForm = this.fb.group({
      id: ['0', [Validators.required]],
      permissions: this.fb.array([]),
    });

  }
  ngOnInit() {
    const id = parseInt(this.route.snapshot.paramMap.get("id")?.toString() || "0");
    this.getRole(id);
    this.permissionsForm.get('id')?.setValue(id);
  }

  getRole(id: number) {
    this.rolesService.getRole(id).subscribe((result: any) => {
      this.isLoading = false;
      this.role = result.role;
      this.permissions = result.permissions;
      this.addCheckboxPermission();
      this.cd.detectChanges();
    }, error => {
      console.log(error);
      if (error?.error?.message) {
        this.toastr.error(error?.error?.message);
        //this.service.logout();
      }
    });
  }

  // Add checkboxes dynamically to the form
  addCheckboxPermission() {
    const permissionsArray = this.permissionsForm.controls['permissions'] as FormArray;
    this.permissions.forEach((permission) => {
      permissionsArray.push(this.fb.control(permission.roles!.length > 0));  // Add false for unchecked state
    });
  }

  addPermissions() {
    if (this.permissionsForm.valid) {
      this.isLoading = true;

      const selectedPermissions = this.permissionsForm.value.permissions
        .map((checked: boolean, i: number) => checked ? this.permissions[i].id : null)
        .filter((v: null) => v !== null);  

      const formattedData = {
        id: this.role.id,
        permissions: selectedPermissions  // This will be an array like permissions[]
      };
      this.rolesService.saveRolePermissions(formattedData).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
        }
      }, error => {
        if (error?.error?.errors?.permissions) {
          this.toastr.error(error?.error?.errors?.permissions);
        }
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
      this.permissionsForm.markAllAsTouched();
      //this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
