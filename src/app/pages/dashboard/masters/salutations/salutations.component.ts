import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { SalutationService } from '@services/dashboard/masters/salutation/salutation.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-salutations',
  templateUrl: './salutations.component.html',
  styleUrl: './salutations.component.scss'
})
export class SalutationsComponent implements OnInit {
  private modalRef:NgbModalRef;
  public isLoading: boolean = true;
  salutationForm!: FormGroup;

  salutations: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private salutationsService: SalutationService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.salutationForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      gender: ['ALL', [Validators.required]],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.salutationsService.getSalutations(page).subscribe((result: any) => {
      this.isLoading = false;
      this.salutations = result.salutations.data;// Set the items
      this.totalItems = result.salutations.total; // Total number of items
      this.perPage = result.salutations.per_page; // Items per page
      this.currentPage = result.salutations.current_page; // Set the current page
      this.toItems = result.salutations.to; // Set to Items
      this.fromItems = result.salutations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, main_type: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (main_type != null) {
      this.salutationForm.get("id").setValue(main_type.id);
      this.salutationForm.get("name").setValue(main_type.name);
      this.salutationForm.get("description").setValue(main_type.description);
      this.salutationForm.get("gender").setValue(main_type.gender);
      this.salutationForm.get("status").setValue(main_type.status);
    } else {
      this.salutationForm.get("id").setValue(0);
      this.salutationForm.get("name").setValue("");
      this.salutationForm.get("description").setValue("");
      this.salutationForm.get("gender").setValue("ALL");
      this.salutationForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.salutationForm.valid) {
      this.isLoading = true;
      this.salutationsService.updateSalutation(this.salutationForm.getRawValue()).subscribe((result: any) => {
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
