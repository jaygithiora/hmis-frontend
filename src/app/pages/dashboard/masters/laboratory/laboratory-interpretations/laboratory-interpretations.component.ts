import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { LaboratoryInterpretationsService } from '@services/dashboard/laboratory/laboratory-interpretations/laboratory-interpretations.service';
import { LaboratoryTestsService } from '@services/dashboard/laboratory/laboratory-tests/laboratory-tests.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';
import { Subject } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-laboratory-interpretations',
  templateUrl: './laboratory-interpretations.component.html',
  styleUrl: './laboratory-interpretations.component.scss'
})
export class LaboratoryInterpretationsComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;
  loadingLaboratoryTests:boolean = false;

  interpretationForm!: FormGroup;

  laboratory_tests: any[] = [];
  searchLaboratoryTests$ = new Subject<string>();
  selectedLaboratoryTestOption: any;

  interpretations: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private laboratoryInterpretationsService: LaboratoryInterpretationsService,
    private laboratoryTestService:LaboratoryTestsService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,
    private service: AuthService) {
    this.interpretationForm = this.fb.group({
      id: ['0', [Validators.required]],
      laboratory_test_id:[null, [Validators.required]],
      interpretation: ['', [Validators.required]],
    });
    this.setupSearch();
  }

  setupSearch() {
    this.searchLaboratoryTests$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingLaboratoryTests = true),  // Show the loading spinner
        switchMap(term => this.laboratoryTestService.getLaboratoryTests(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        this.laboratory_tests = results.laboratory_tests.data;
        this.loadingLaboratoryTests = false;  // Hide the loading spinner when the API call finishes
      });
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.laboratoryInterpretationsService.getLaboratoryInterpretations(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.interpretations = result.interpretations.data;// Set the items
      this.totalItems = result.interpretations.total; // Total number of items
      this.perPage = result.interpretations.per_page; // Items per page
      this.currentPage = result.interpretations.current_page; // Set the current page
      this.toItems = result.interpretations.to; // Set to Items
      this.fromItems = result.interpretations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, interpretation: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (interpretation != null) {
      this.interpretationForm.get("id").setValue(interpretation.id);
      this.interpretationForm.get("interpretation").setValue(interpretation.interpretation);
      this.laboratory_tests.push(interpretation.laboratory_test);
      this.selectedLaboratoryTestOption = interpretation.laboratory_test_id;
    } else {
      this.interpretationForm.get("id").setValue(0);
      this.interpretationForm.get("interpretation").setValue("");
      this.selectedLaboratoryTestOption = null;
    }
  }
  addInterpretation() {
    if (this.interpretationForm.valid) {
      this.isLoading = true;
      this.laboratoryInterpretationsService.updateLaboratoryInterpretation(this.interpretationForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.laboratory_test_id) {
          this.toastr.error(error?.error?.errors?.laboratory_test_id);
        }
        if (error?.error?.errors?.interpretation) {
          this.toastr.error(error?.error?.errors?.interpretation);
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

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}
