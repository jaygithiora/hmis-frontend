import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { MainTypesService } from '@services/dashboard/masters/manin-types/main-types.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, Subject, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-sub-types',
  templateUrl: './sub-types.component.html',
  styleUrl: './sub-types.component.scss'
})
export class SubTypesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  subtypeForm!: FormGroup;

  main_types: any[] = [];
  search$ = new Subject<string>();
  selectedOption: any;

  sub_types: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private subtypeService: SubTypesService, private mainTypeService: MainTypesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.subtypeForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      main_type: ['', [Validators.required]],
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
        switchMap(term => this.mainTypeService.getMainTypes(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.main_types = results.main_types.data;
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
    this.subtypeService.getSubTypes(page, "", 0).subscribe((result: any) => {
      this.isLoading = false;
      this.sub_types = result.sub_types.data;// Set the items
      this.totalItems = result.sub_types.total; // Total number of items
      this.perPage = result.sub_types.per_page; // Items per page
      this.currentPage = result.sub_types.current_page; // Set the current page
      this.toItems = result.sub_types.to; // Set to Items
      this.fromItems = result.sub_types.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, sub_type: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (sub_type != null) {
      this.subtypeForm.get("id").setValue(sub_type.id);
      this.subtypeForm.get("name").setValue(sub_type.name);
      this.subtypeForm.get("description").setValue(sub_type.description);
      this.main_types.push(sub_type.main_type);
      this.selectedOption = sub_type.main_type_id;
      this.subtypeForm.get("status").setValue(sub_type.status);
    } else {
      this.subtypeForm.get("id").setValue(0);
      this.subtypeForm.get("name").setValue("");
      this.subtypeForm.get("description").setValue("");
      this.selectedOption = null;
      this.subtypeForm.get("status").setValue(1);
    }
  }
  addLocation() {
    if (this.subtypeForm.valid) {
      this.isLoading = true;
      this.subtypeService.updateSubTypes(this.subtypeForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.main_type) {
          this.toastr.error(error?.error?.errors?.main_type);
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

