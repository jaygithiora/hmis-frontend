import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { ConsultationService } from '@services/dashboard/consultation/consultation.service';
import { TriageService } from '@services/dashboard/triage/triage/triage.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-consultation-list',
  templateUrl: './consultation-list.component.html',
  styleUrl: './consultation-list.component.scss'
})
export class ConsultationListComponent implements OnInit {
  private modalRef: NgbModalRef;
  public isLoading: boolean = true;
  loading: boolean = false;

  outpatient_visit_consultations: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page

  constructor(private consultationService: ConsultationService , private toastr: ToastrService, private service: AuthService) {
  }
  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.consultationService.getConsultations(page).subscribe((result: any) => {
      this.isLoading = false;
      this.outpatient_visit_consultations = result.outpatient_visit_consultations.data;// Set the items
      this.totalItems = result.outpatient_visit_consultations.total; // Total number of items
      this.perPage = result.outpatient_visit_consultations.per_page; // Items per page
      this.currentPage = result.outpatient_visit_consultations.current_page; // Set the current page
      this.toItems = result.outpatient_visit_consultations.to; // Set to Items
      this.fromItems = result.outpatient_visit_consultations.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }

  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}



