import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DoseMeasuresService } from '@services/dashboard/inventory/dose-measures/dose-measures.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dose-measures',
  templateUrl: './dose-measures.component.html',
  styleUrl: './dose-measures.component.scss'
})
export class DoseMeasuresComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  doseMeasureForm!: FormGroup;

  dose_measures: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private doseMeasureService: DoseMeasuresService, private modalService: NgbModal,
    private fb: FormBuilder, private toastr: ToastrService, private service:AuthService) {
    this.doseMeasureForm = this.fb.group({
      id: ['0', [Validators.required]],
      name: ['', [Validators.required]],
      status: ['1', [Validators.required]]
    });

  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.doseMeasureService.getDoseMeasures(page).subscribe((result: any) => {
      this.isLoading = false;
      this.dose_measures = result.dose_measures.data;// Set the items
      this.totalItems = result.dose_measures.total; // Total number of items
      this.perPage = result.dose_measures.per_page; // Items per page
      this.currentPage = result.dose_measures.current_page; // Set the current page
      this.toItems = result.dose_measures.to; // Set to Items
      this.fromItems = result.dose_measures.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, location: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (location != null) {
      this.doseMeasureForm.get("id").setValue(location.id);
      this.doseMeasureForm.get("name").setValue(location.name);
      this.doseMeasureForm.get("status").setValue(location.status);
    } else {
      this.doseMeasureForm.get("id").setValue(0);
      this.doseMeasureForm.get("name").setValue("");
      this.doseMeasureForm.get("status").setValue(1);
    }
  }
  addInventoryCategory() {
    if (this.doseMeasureForm.valid) {
      this.isLoading = true;
      this.doseMeasureService.updateDoseMeasure(this.doseMeasureForm.getRawValue()).subscribe((result: any) => {

        this.isLoading = false;
        if (result.success) {
          this.toastr.success(result.success);
          this.loadPage(1);
          this.modalRef?.close();
        }
      }, error => {
        if(error?.error?.errors?.code){
          this.toastr.error(error?.error?.errors?.code);
        }
        if(error?.error?.errors?.name){
          this.toastr.error(error?.error?.errors?.name);
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
