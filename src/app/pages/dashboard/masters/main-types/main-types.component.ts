import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { MainTypesService } from '@services/dashboard/masters/manin-types/main-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-main-types',
  templateUrl: './main-types.component.html',
  styleUrl: './main-types.component.scss'
})
export class MainTypesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  mainTypeForm!: FormGroup;

  main_types: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private masterTypeService: MainTypesService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.mainTypeForm = this.fb.group({
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
    this.isLoading = true;
    this.masterTypeService.getMainTypes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.main_types = result.main_types.data;// Set the items
      this.totalItems = result.main_types.total; // Total number of items
      this.perPage = result.main_types.per_page; // Items per page
      this.currentPage = result.main_types.current_page; // Set the current page
      this.toItems = result.main_types.to; // Set to Items
      this.fromItems = result.main_types.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, main_type: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (main_type != null) {
      this.mainTypeForm.get("id").setValue(main_type.id);
      this.mainTypeForm.get("name").setValue(main_type.name);
      this.mainTypeForm.get("description").setValue(main_type.description);
      this.mainTypeForm.get("status").setValue(main_type.status);
    } else {
      this.mainTypeForm.get("id").setValue(0);
      this.mainTypeForm.get("name").setValue("");
      this.mainTypeForm.get("description").setValue("");
      this.mainTypeForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.mainTypeForm.valid) {
      this.isLoading = true;
      this.masterTypeService.updateMainType(this.mainTypeForm.getRawValue()).subscribe((result: any) => {
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
        if(error?.error?.errors?.description){
          this.toastr.error(error?.error?.errors?.description);
        }
        if(error?.error?.errors?.code){
          this.toastr.error(error?.error?.errors?.code);
        }
        if (error?.error?.message) {
          this.toastr.error(error?.error?.message);
          this.service.logout();
          this.modalRef?.close();
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
