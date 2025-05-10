import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { LaboratoryTestRatesService } from '@services/dashboard/laboratory/laboratory-test-rates/laboratory-test-rates.service';
import { LaboratoryTestReferencesService } from '@services/dashboard/laboratory/laboratory-test-references/laboratory-test-references.service';
import { LaboratoryTestsService } from '@services/dashboard/laboratory/laboratory-tests/laboratory-tests.service';
import { SubTypesService } from '@services/dashboard/masters/sub-types/sub-types.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-laboratory-test-references',
  templateUrl: './laboratory-test-references.component.html',
  styleUrl: './laboratory-test-references.component.scss'
})
export class LaboratoryTestReferencesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  laboratoryTestReferenceForm!: FormGroup;

laboratory_tests: any[] = [];
  sub_types: any[] = [];

  search$ = new Subject<string>();

  selectedOption: any;

  laboratory_test_references: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private laboratoryTestsService: LaboratoryTestsService, private laboratoryTestReferenceService: LaboratoryTestReferencesService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.laboratoryTestReferenceForm = this.fb.group({
      id: ['0', [Validators.required]],
      laboratory_test: ['', [Validators.required]],
      name: ['', [Validators.required]],
      reference_type: ['', [Validators.required]], //Qualitative,Quantitative
      subheader: [''],
      gender: ['', [Validators.required]],
      agefrom:[''],
      ageto:[''],
      ref_range_label: [''],
      ref_order:[''],
      ref_code:[''],
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
        switchMap(term => this.laboratoryTestsService.getLaboratoryTests(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.laboratory_tests = results.laboratory_tests.data;
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
    this.laboratoryTestReferenceService.getLaboratoryTestReferences(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.laboratory_test_references = result.laboratory_test_references.data;// Set the items
      this.totalItems = result.laboratory_test_references.total; // Total number of items
      this.perPage = result.laboratory_test_references.per_page; // Items per page
      this.currentPage = result.laboratory_test_references.current_page; // Set the current page
      this.toItems = result.laboratory_test_references.to; // Set to Items
      this.fromItems = result.laboratory_test_references.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, labotatory_test_reference: any) {
    this.modalRef = this.modalService.open(content, { centered: true});
    if (labotatory_test_reference != null) {
      this.laboratoryTestReferenceForm.get("id").setValue(labotatory_test_reference.id);
      this.laboratoryTestReferenceForm.get("name").setValue(labotatory_test_reference.name);
        this.laboratory_tests.push(labotatory_test_reference.laboratory_test);
        this.selectedOption = labotatory_test_reference.laboratory_test_id;
        this.laboratoryTestReferenceForm.get("subheader").setValue(labotatory_test_reference.subheader);
        this.laboratoryTestReferenceForm.get("reference_type").setValue(labotatory_test_reference.reference_type);
        this.laboratoryTestReferenceForm.get("gender").setValue(labotatory_test_reference.gender);
        this.laboratoryTestReferenceForm.get("agefrom").setValue(labotatory_test_reference.agefrom);
        this.laboratoryTestReferenceForm.get("ageto").setValue(labotatory_test_reference.ageto);
        this.laboratoryTestReferenceForm.get("ref_range_label").setValue(labotatory_test_reference.ref_range_label);
        this.laboratoryTestReferenceForm.get("ref_order").setValue(labotatory_test_reference.ref_order);
        this.laboratoryTestReferenceForm.get("ref_code").setValue(labotatory_test_reference.subheader);
      this.laboratoryTestReferenceForm.get("status").setValue(labotatory_test_reference.status);
    } else {
      this.laboratoryTestReferenceForm.get("id").setValue(0);
      this.laboratoryTestReferenceForm.get("name").setValue("");
      this.selectedOption = null;
      this.laboratoryTestReferenceForm.get("subheader").setValue("");
      this.laboratoryTestReferenceForm.get("reference_type").setValue("Qualitative");
      this.laboratoryTestReferenceForm.get("gender").setValue("ALL");
      this.laboratoryTestReferenceForm.get("agefrom").setValue("");
      this.laboratoryTestReferenceForm.get("ageto").setValue("");
      this.laboratoryTestReferenceForm.get("ref_range_label").setValue("");
      this.laboratoryTestReferenceForm.get("ref_order").setValue("");
      this.laboratoryTestReferenceForm.get("ref_code").setValue("");
      this.laboratoryTestReferenceForm.get("status").setValue("1");
    }
  }
  addLocation() {
    if (this.laboratoryTestReferenceForm.valid) {
      this.isLoading = true;
      this.laboratoryTestReferenceService.updateLaboratoryTestReferences(this.laboratoryTestReferenceForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.laboratory_test) {
          this.toastr.error(error?.error?.errors?.laboratory_test);
        }
        if (error?.error?.errors?.subheader) {
          this.toastr.error(error?.error?.errors?.subheader);
        }
        if (error?.error?.errors?.reference_type) {
          this.toastr.error(error?.error?.errors?.reference_type);
        }
        if (error?.error?.errors?.gender) {
          this.toastr.error(error?.error?.errors?.gender);
        }
        if (error?.error?.errors?.agefrom) {
          this.toastr.error(error?.error?.errors?.agefrom);
        }
        if (error?.error?.errors?.ageto) {
          this.toastr.error(error?.error?.errors?.ageto);
        }
        if (error?.error?.errors?.reference_range_label) {
          this.toastr.error(error?.error?.errors?.reference_range_label);
        }
        if (error?.error?.errors?.ref_order) {
          this.toastr.error(error?.error?.errors?.ref_order);
        }
        if (error?.error?.errors?.ref_code) {
          this.toastr.error(error?.error?.errors?.ref_code);
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





