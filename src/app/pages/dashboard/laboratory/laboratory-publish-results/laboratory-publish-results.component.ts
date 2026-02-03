import { Component, OnInit} from '@angular/core';
import { FormGroup, FormBuilder, FormArray} from '@angular/forms';
import { AuthService } from '@services/auth/auth.service';
import { LaboratoryPublishResultsService } from '@services/dashboard/laboratory/laboratory-publish-results/laboratory-publish-results.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-laboratory-publish-results',
  templateUrl: './laboratory-publish-results.component.html',
  styleUrl: './laboratory-publish-results.component.scss'
})
export class LaboratoryPublishResultsComponent implements OnInit {
  public isLoading: boolean = true;
  loading: boolean = false;

  publishTestForm!: FormGroup;

  laboratory_test_results: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor( private laboratoryPublishResultsService: LaboratoryPublishResultsService,private fb: FormBuilder, private toastr: ToastrService, private service: AuthService) {
    this.publishTestForm = this.fb.group({
      selectAll:[false],
      consultation_items: this.fb.array([]),
    });
  }

  get selectedItemsArray(): FormArray {
    return this.publishTestForm.get('consultation_items') as FormArray;
  }
// Handle "Select All" checkbox change
  onSelectAllChange(event: any) {
    const checked = event.target.checked;
    
    // Clear all selections
    this.selectedItemsArray.clear();

    if (checked) {
      // Add all items to the array
      this.laboratory_test_results.forEach(item => {
        this.selectedItemsArray.push(this.fb.group({
        id: [item.id],
      }));
      });
    }
  }

  onCheckboxChange(event: any, item: any) {
    if (event.target.checked) {
      // Add entire object or specific fields
      this.selectedItemsArray.push(this.fb.group({
        id: [item.id],
      }));
    } else {
      // Remove from array
      const index = this.selectedItemsArray.controls.findIndex(
        (x: any) => x.get('id')?.value === item.id
      );
      if (index !== -1) {
        this.selectedItemsArray.removeAt(index);
      }
    }
    // Update "Select All" checkbox state
    this.updateSelectAllState();
  }
  
  // Update "Select All" checkbox based on individual selections
  updateSelectAllState() {
    const allSelected = this.laboratory_test_results.length === this.selectedItemsArray.length;
    this.publishTestForm.get('selectAll')?.setValue(allSelected, { emitEvent: false });
  }


  isSelected(itemId: number): boolean {
    return this.selectedItemsArray.controls.some(
      (x: any) => x.get('id')?.value === itemId
    );
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.laboratoryPublishResultsService.getLaboratoryPublishResults(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.laboratory_test_results = result.results.data;// Set the items
      this.totalItems = result.results.total; // Total number of items
      this.perPage = result.results.per_page; // Items per page
      this.currentPage = result.results.current_page; // Set the current page
      this.toItems = result.results.to; // Set to Items
      this.fromItems = result.results.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  addLocation() {
    if (this.publishTestForm.valid) {
      console.log(this.publishTestForm.getRawValue());
      this.isLoading = true;
      this.laboratoryPublishResultsService.updatePublishResults(this.publishTestForm.getRawValue()).subscribe((result: any) => {
        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
        }
      }, error => {
        if (error?.error?.errors?.id) {
          this.toastr.error(error?.error?.errors?.id);
        }
        if (error?.error?.errors?.name) {
          this.toastr.error(error?.error?.errors?.name);
        }
        if (error?.error?.errors?.laboratory_category) {
          this.toastr.error(error?.error?.errors?.laboratory_category);
        }
        if (error?.error?.errors?.sample_type) {
          this.toastr.error(error?.error?.errors?.sample_type);
        }
        if (error?.error?.errors?.amount) {
          this.toastr.error(error?.error?.errors?.amount);
        }
        if (error?.error?.errors?.status) {
          this.toastr.error(error?.error?.errors?.status);
        }
        if (error?.error?.error) {
          this.toastr.error(error?.error?.error);
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

