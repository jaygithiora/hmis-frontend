import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModalRef, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { DoctorFeesService } from '@services/dashboard/masters/doctors/doctor-fees/doctor-fees.service';
import { DoctorShareService } from '@services/dashboard/masters/doctors/doctor-share/doctor-share.service';
import { DoctorSpecializationsService } from '@services/dashboard/masters/doctors/doctor-specializations/doctor-specializations.service';
import { DoctorsService } from '@services/dashboard/masters/doctors/doctors/doctors.service';
import { SchemesService } from '@services/dashboard/masters/insurances/schemes/schemes.service';
import { FeeTypesService } from '@services/dashboard/settings/fee-types/fee-types.service';
import { UsersService } from '@services/dashboard/users/users.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { Subject, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs';

@Component({
  selector: 'app-doctor-share',
  templateUrl: './doctor-share.component.html',
  styleUrl: './doctor-share.component.scss'
})
export class DoctorShareComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loadingDoctors: boolean = false;

  doctorShareForm!: FormGroup;

  doctors: any[] = [];

  searchDoctors$ = new Subject<string>();

  selectedDoctor: any;

  doctor_shares: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  share_types = [{id:'percentage',name:"Percentage"},{id:"amount",name:"Amount"}];

  constructor(private doctorsService: DoctorsService, private doctorShareService: DoctorShareService,
    private modalService: NgbModal, private fb: FormBuilder, private toastr: ToastrService,private service: AuthService, private usersService: UsersService) {
    this.doctorShareForm = this.fb.group({
      id: ['0', [Validators.required]],
      doctor: [null, [Validators.required]],
      share_type: ["percentage", [Validators.required]],
      amount: [null, [Validators.required]],
    });

    this.setupSearch();
  }

  setupSearch() {
    this.searchDoctors$
      .pipe(
        debounceTime(300),  // Wait for the user to stop typing for 300ms
        distinctUntilChanged(),  // Only search if the query has changed
        tap(() => this.loadingDoctors = true),  // Show the loading spinner
        switchMap(term => this.doctorsService.getDoctors(1, term))  // Switch to a new observable for each search term
      )
      .subscribe(results => {
        console.log(results);
        this.doctors = results.doctors.data.map(element => ({
          id: element.id,
          name: `(${element?.code}) ${element?.salutation?.name} ${element?.firstname} ${element?.other_names}`
        }));;
        this.loadingDoctors = false;  // Hide the loading spinner when the API call finishes
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
    this.doctorShareService.getDoctorShares(page).subscribe((result: any) => {
      this.isLoading = false;
      this.doctor_shares = result.doctor_shares.data;// Set the items
      this.totalItems = result.doctor_shares.total; // Total number of items
      this.perPage = result.doctor_shares.per_page; // Items per page
      this.currentPage = result.doctor_shares.current_page; // Set the current page
      this.toItems = result.doctor_shares.to; // Set to Items
      this.fromItems = result.doctor_shares.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  openModal(content: TemplateRef<any>, doctorShare: any) {
    this.modalRef = this.modalService.open(content, { centered: true });
    if (doctorShare != null) {
      this.doctors = [];
      this.doctorShareForm.get("id").setValue(doctorShare.id);
      this.doctorShareForm.get("amount").setValue(doctorShare.amount);
      this.doctorShareForm.get("share_type").setValue(doctorShare.share_type);
      if (doctorShare.doctor != null) {
        this.doctors.push({id:doctorShare.doctor_id, name:`(${doctorShare?.doctor?.code}) ${doctorShare?.doctor?.firstname} ${doctorShare?.doctor?.other_names}`});
        this.selectedDoctor = doctorShare.doctor_id;
      }
    } else {
      this.doctorShareForm.get("id").setValue(0);
      this.doctorShareForm.get("amount").setValue("");
      this.doctorShareForm.get("share_type").setValue("percentage");
      this.selectedDoctor=null;
    }
  }
  addDoctorShare() {
    if (this.doctorShareForm.valid) {
      this.isLoading = true;
      this.doctorShareService.updateDoctorShare(this.doctorShareForm.getRawValue()).subscribe((result: any) => {
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
        if (error?.error?.errors?.doctor) {
          this.toastr.error(error?.error?.errors?.doctor);
        }
        if (error?.error?.errors?.share_type) {
          this.toastr.error(error?.error?.errors?.share_type);
        }
        if (error?.error?.errors?.amount) {
          this.toastr.error(error?.error?.errors?.amount);
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
      this.doctorShareForm.markAllAsTouched();
      this.toastr.error("Please fill in all the required fields before proceeding!");
    }
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}

