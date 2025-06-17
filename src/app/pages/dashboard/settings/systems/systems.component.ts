import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { StatusesService } from '@services/dashboard/settings/statuses/statuses.service';
import { SystemsService } from '@services/dashboard/settings/systems/systems.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-systems',
  templateUrl: './systems.component.html',
  styleUrl: './systems.component.scss'
})
export class SystemsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  systemsForm!: FormGroup;

  systems: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  actions = [{id:"proceed", name: "Proceed"}, {id:"maintain", name:"Maintain"}, {id:"remove", name:"Remove"}];
  selectedOption;

  constructor(private systemsService: SystemsService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.systemsForm = this.fb.group({
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
    this.systemsService.getSystems(page).subscribe((result: any) => {
      this.isLoading = false;
      this.systems = result.systems.data;// Set the items
      this.totalItems = result.systems.total; // Total number of items
      this.perPage = result.systems.per_page; // Items per page
      this.currentPage = result.systems.current_page; // Set the current page
      this.toItems = result.systems.to; // Set to Items
      this.fromItems = result.systems.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, systems: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (systems != null) {
      this.systemsForm.get("id").setValue(systems.id);
      this.systemsForm.get("name").setValue(systems.name);
      this.systemsForm.get("description").setValue(systems.description);
      this.systemsForm.get("status").setValue(systems.status);
    } else {
      this.systemsForm.get("id").setValue(0);
      this.systemsForm.get("name").setValue("");
      this.systemsForm.get("description").setValue("");
      this.systemsForm.get("status").setValue(1);
    }
  }

  addSystem() {
    if (this.systemsForm.valid) {
      this.isLoading = true;
      this.systemsService.updateSystem(this.systemsForm.getRawValue()).subscribe((result: any) => {
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


