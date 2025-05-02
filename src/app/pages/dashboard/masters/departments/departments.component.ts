import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DepartmentsService } from '@services/dashboard/masters/departments/departments.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-departments',
  templateUrl: './departments.component.html',
  styleUrl: './departments.component.scss'
})
export class DepartmentsComponent  implements OnInit {
  public isLoading: boolean = true;
  departmentForm!: FormGroup;

  departments: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private departmentsService: DepartmentsService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.departmentForm = this.fb.group({
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
    this.departmentsService.getDepartments(page).subscribe((result: any) => {
      this.isLoading = false;
      this.departments = result.departments.data;// Set the items
      this.totalItems = result.departments.total; // Total number of items
      this.perPage = result.departments.per_page; // Items per page
      this.currentPage = result.departments.current_page; // Set the current page
      this.toItems = result.departments.to; // Set to Items
      this.fromItems = result.departments.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, main_type: any) {
    this.modalService.open(content, { centered: true });
    if (main_type != null) {
      this.departmentForm.get("id").setValue(main_type.id);
      this.departmentForm.get("name").setValue(main_type.name);
      this.departmentForm.get("description").setValue(main_type.description);
      this.departmentForm.get("status").setValue(main_type.status);
    } else {
      this.departmentForm.get("id").setValue(0);
      this.departmentForm.get("name").setValue("");
      this.departmentForm.get("description").setValue("");
      this.departmentForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.departmentForm.valid) {
      this.isLoading = true;
      this.departmentsService.updateDepartment(this.departmentForm.getRawValue()).subscribe((result: any) => {
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
        if(error?.error?.errors?.description){
          this.toastr.error(error?.error?.errors?.description);
        }
        if(error?.error?.errors?.gender){
          this.toastr.error(error?.error?.errors?.gender);
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
