import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { GenericNameService } from '@services/dashboard/masters/generic-names/generic-name.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-generic-names',
  templateUrl: './generic-names.component.html',
  styleUrl: './generic-names.component.scss'
})
export class GenericNamesComponent  implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  genericNameForm!: FormGroup;

  generic_names: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private genericNameService:GenericNameService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.genericNameForm = this.fb.group({
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
    this.genericNameService.getGenericNames(page).subscribe((result: any) => {
      this.isLoading = false;
      this.generic_names = result.generic_names.data;// Set the items
      this.totalItems = result.generic_names.total; // Total number of items
      this.perPage = result.generic_names.per_page; // Items per page
      this.currentPage = result.generic_names.current_page; // Set the current page
      this.toItems = result.generic_names.to; // Set to Items
      this.fromItems = result.generic_names.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, main_type: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (main_type != null) {
      this.genericNameForm.get("id").setValue(main_type.id);
      this.genericNameForm.get("name").setValue(main_type.name);
      this.genericNameForm.get("description").setValue(main_type.description);
      this.genericNameForm.get("status").setValue(main_type.status);
    } else {
      this.genericNameForm.get("id").setValue(0);
      this.genericNameForm.get("name").setValue("");
      this.genericNameForm.get("description").setValue("");
      this.genericNameForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.genericNameForm.valid) {
      this.isLoading = true;
      this.genericNameService.updateGenericNames(this.genericNameForm.getRawValue()).subscribe((result: any) => {
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
