import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, TemplateRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { PackagesService } from '@services/dashboard/subscriptions/packages/packages.service';
import { PermissionsService } from '@services/dashboard/subscriptions/permissions/permissions.service';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, tap, switchMap } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-package-permissions',
  templateUrl: './package-permissions.component.html',
  styleUrl: './package-permissions.component.scss'
})
export class PackagePermissionsComponent implements OnInit {
  public isLoading: boolean = false;
  public loadingPermissions: boolean = false;
  private modalRef: NgbModalRef;
  packagePermissionsForm!: FormGroup;

  active = 1;
  activeIds: string = "custom-panel-package, custom-panel-permissions";

  subscription_package: any;

  permissions: any[] = [];
  searchPermissions$ = new Subject<string>();
  selected_permissions: number[] = [];

  subscription_package_permissions: any[] = [];
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private fb: FormBuilder, private toastr: ToastrService, private packagesService: PackagesService, private permissionsService: PermissionsService,
    private service: AuthService, private router: Router, private activatedRoute: ActivatedRoute, private modalService: NgbModal) {
    this.packagePermissionsForm = this.fb.group({
      id: ['0', [Validators.required]],
      permissions: [[], [Validators.required]]
    });
  }

  ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get("id");
    if (id != null) {
      this.packagePermissionsForm.get("id").setValue(id);
      this.isLoading = true;
      this.packagesService.getSubscriptionPackage(parseInt(id)).subscribe((result: any) => {
        this.subscription_package = result.subscription_package;
        this.isLoading = false;
        this.loadPage(1);
      }, error => {
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
        }
        this.isLoading = false;
        console.log(error);
      });
      this.loadOptions();
    } else {
      this.router.navigate(["dashboard/subscriptions/packages"]);
    }
    /*this.formPrescriptions.valueChanges.subscribe(v => {
  console.log('FORM CHANGE', v);
});*/
  }
loadOptions() {
    this.searchPermissions$.pipe(
      debounceTime(300),
      tap(() => this.loadingPermissions = true),
      switchMap(term => this.permissionsService.getPermissions(1, term)),
      tap(() => this.loadingPermissions= false)
    ).subscribe(data => {
      this.permissions = data.permissions.data;
    });
  }
  loadPage(page: number) {
    this.isLoading = true;
    this.packagesService.getSubscriptionPackagePermissions(page, "", this.packagePermissionsForm.get("id")?.value).subscribe((result: any) => {
      this.isLoading = false;
      this.subscription_package_permissions = result.subscription_package_permissions.data;// Set the items
      this.totalItems = result.subscription_package_permissions.total; // Total number of items
      this.perPage = result.subscription_package_permissions.per_page; // Items per page
      this.currentPage = result.subscription_package_permissions.current_page; // Set the current page
      this.toItems = result.subscription_package_permissions.to; // Set to Items
      this.fromItems = result.subscription_package_permissions.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }
  openModal(content: TemplateRef<any>, permission: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    this.selected_permissions = [];
    /*if (permission != null) {
      this.packagePermissionsForm.get("id").setValue(permission.id);
      this.packagePermissionsForm.get("name").setValue(permission.name);
      this.packagePermissionsForm.get("status").setValue(permission.status);
    } else {
      this.packagePermissionsForm.get("id").setValue(0);
      this.packagePermissionsForm.get("name").setValue("");
      this.packagePermissionsForm.get("status").setValue(1);
    }*/
  }
  addPackagePermissions() {
    if (this.packagePermissionsForm.valid) {
      this.isLoading = true;
      this.permissionsService.updatePermissions(this.packagePermissionsForm.getRawValue()).subscribe((result: any) => {

        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if (error?.error?.errors?.permissions) {
          this.toastr.error(error?.error?.errors?.permissions);
        }
        if (error?.error?.error) {
          this.toastr.error(error?.error?.error);
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
  
  removePackagePermission(id:number) {
      this.isLoading = true;
      this.permissionsService.removePermission({id:id}).subscribe((result: any) => {
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
        if (error?.error?.error) {
          this.toastr.error(error?.error?.error);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
          this.modalRef?.close();
        }
        this.isLoading = false;
        console.log(error);
      });
  }
}
