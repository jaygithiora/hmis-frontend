import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { SchemesService } from '@services/dashboard/masters/insurances/schemes/schemes.service';
import { InsurancesService } from '@services/dashboard/masters/insurances/insurances/insurances.service';

@Component({
  selector: 'app-schemes',
  templateUrl: './schemes.component.html',
  styleUrl: './schemes.component.scss'
})
export class SchemesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  schemeForm!: FormGroup;

  insurances: any[] = [];// Store fetched items

  selectedOption: any;

  search$ = new Subject<string>();

  schemes: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private insurancesService: InsurancesService, private schemesService: SchemesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.schemeForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
      insurance: [null, [Validators.required]],
    });
    this.setupSearch();
  }

  setupSearch() {
    this.search$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loading = true),  // Show the loading spinner
        switchMap(term => this.insurancesService.getInsurances(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.insurances = results.insurances.data;
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
    this.schemesService.getSchemes(page).subscribe((result: any) => {
      this.isLoading = false;
      this.schemes = result.schemes.data;// Set the items
      this.totalItems = result.schemes.total; // Total number of items
      this.perPage = result.schemes.per_page; // Items per page
      this.currentPage = result.schemes.current_page; // Set the current page
      this.toItems = result.schemes.to; // Set to Items
      this.fromItems = result.schemes.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, scheme: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (scheme != null) {
      this.insurances = [];
      this.schemeForm.get("id").setValue(scheme.id);
      this.schemeForm.get("name").setValue(scheme.name);
      this.schemeForm.get("description").setValue(scheme.description);
      const exists = this.insurances.some(
        (p: any) => p.id === scheme.insurance.id
      );

      if (!exists) {
        this.insurances.push(scheme.insurance);
      }
      this.selectedOption = scheme.insurance_id;
    } else {
      this.schemeForm.get("id").setValue(0);
      this.schemeForm.get("name").setValue("");
      this.schemeForm.get("description").setValue("");
      this.selectedOption = null;
    }
  }

  addScheme() {
    if (this.schemeForm.valid) {
      this.isLoading = true;
      this.schemesService.updateScheme(this.schemeForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.insurance) {
          this.toastr.error(error?.error?.errors?.insurance);
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
      this.schemeForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

