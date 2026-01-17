import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DrugFrequenciesService } from '@services/dashboard/inventory/drug_frequencies/drug-frequencies.service';
import { StrengthUnitsService } from '@services/dashboard/inventory/strength-units/strength-units.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-drug-frequencies',
  templateUrl: './drug-frequencies.component.html',
  styleUrl: './drug-frequencies.component.scss'
})
export class DrugFrequenciesComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  drugFrequencyForm!: FormGroup;

  drug_frequencies: any[] = [];// Store fetched items
  totalItems = 0;// Total number of items
  currentPage = 1;// Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;// Items per page

  constructor(private drugFrequenciesService: DrugFrequenciesService, private modalService: NgbModal, private fb: FormBuilder,
    private toastr: ToastrService, private service: AuthService, private router: Router) {
    this.drugFrequencyForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      frequency: ['', [Validators.required]],
      duration: ['daily', [Validators.required]],
      description: ['']
    });
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number): void {
    this.isLoading = true;
    this.drugFrequenciesService.getDrugFrequencies(page).subscribe((result: any) => {
      this.isLoading = false;
      this.drug_frequencies = result.drug_frequencies.data;// Set the items
      this.totalItems = result.drug_frequencies.total; // Total number of items
      this.perPage = result.drug_frequencies.per_page; // Items per page
      this.currentPage = result.drug_frequencies.current_page; // Set the current page
      this.toItems = result.drug_frequencies.to; // Set to Items
      this.fromItems = result.drug_frequencies.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, drug_frequency: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (drug_frequency != null) {
      this.drugFrequencyForm.get("id").setValue(drug_frequency.id);
      this.drugFrequencyForm.get("name").setValue(drug_frequency.name);
      this.drugFrequencyForm.get("description").setValue(drug_frequency.description);
      this.drugFrequencyForm.get("frequency").setValue(drug_frequency.frequency);
      this.drugFrequencyForm.get("duration").setValue(drug_frequency.duration);
    } else {
      this.drugFrequencyForm.get("id").setValue(0);
      this.drugFrequencyForm.get("name").setValue("");
      this.drugFrequencyForm.get("description").setValue("");
      this.drugFrequencyForm.get("frequency").setValue("");
      this.drugFrequencyForm.get("duration").setValue("daily");
    }
  }

  addStrengthUnit() {
    if (this.drugFrequencyForm.valid) {
      this.isLoading = true;
      this.drugFrequenciesService.updateDrugFrequency(this.drugFrequencyForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.frequency) {
          this.toastr.error(error?.error?.errors?.frequency);
        }
        if (error?.error?.errors?.duration) {
          this.toastr.error(error?.error?.errors?.duration);
        }
        if (error?.error?.errors?.description) {
          this.toastr.error(error?.error?.errors?.description);
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

