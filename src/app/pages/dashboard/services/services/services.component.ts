import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ServiceCategoriesService } from '@services/dashboard/services/service-categories/service-categories.service';
import { ServicesService} from '@services/dashboard/services/services/services.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss'
})
export class ServicesComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  servicesForm!: FormGroup;

  service_categories: any[] = [];// Store fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  services: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private serviceCategoryService: ServiceCategoriesService, private servicesService:ServicesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.servicesForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      service_category: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });
    this.setupSearch();
  }

  setupSearch() {
    this.search$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loading = true),  // Show the loading spinner
        switchMap(term => this.serviceCategoryService.getServiceCategories(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.service_categories = results.service_categories.data;
        this.loading = false;  // Hide the loading spinner when the API call finishes
      });
  }
  // Handle item selection
  onItemSelect(event: any) {
    console.log('Selected item:', event);
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.servicesService.getServices(page).subscribe((result: any) => {
      this.isLoading = false;
      this.services = result.services.data;// Set the items
      this.totalItems = result.services.total; // Total number of items
      this.perPage = result.services.per_page; // Items per page
      this.currentPage = result.services.current_page; // Set the current page
      this.toItems = result.services.to; // Set to Items
      this.fromItems = result.services.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, service: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (service != null) {
      this.servicesForm.get("id").setValue(service.id);
      this.servicesForm.get("name").setValue(service.name);
      this.service_categories.push(service.service_category);
      this.selectedOption = service.service_category_id;
      this.servicesForm.get("status").setValue(service.status);
    } else {
      this.servicesForm.get("id").setValue(0);
      this.servicesForm.get("name").setValue("");
      this.selectedOption = null;
      this.servicesForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.servicesForm.valid) {
      this.isLoading = true;
      this.servicesService.updateService(this.servicesForm.getRawValue()).subscribe((result: any) => {
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
