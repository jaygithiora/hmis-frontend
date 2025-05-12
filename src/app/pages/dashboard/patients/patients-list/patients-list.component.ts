import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { PatientRegistrationService } from '@services/dashboard/patients/patient-registration/patient-registration.service';
import { RadiologyCategoriesService } from '@services/dashboard/radiology/radiology-categories/radiology-categories.service';
import { RadiologyItemsService } from '@services/dashboard/radiology/radiology-items/radiology-items.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-patients-list',
  templateUrl: './patients-list.component.html',
  styleUrl: './patients-list.component.scss'
})
export class PatientsListComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;

  patients: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private patientRegistrationService:PatientRegistrationService, private toastr: ToastrService, private service: AuthService) {
   
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.patientRegistrationService.getPatientRegistrations(page).subscribe((result: any) => {
      this.isLoading = false;
      this.patients = result.patients.data;// Set the items
      this.totalItems = result.patients.total; // Total number of items
      this.perPage = result.patients.per_page; // Items per page
      this.currentPage = result.patients.current_page; // Set the current page
      this.toItems = result.patients.to; // Set to Items
      this.fromItems = result.patients.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }


  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

