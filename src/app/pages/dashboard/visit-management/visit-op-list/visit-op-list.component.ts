import { Component, OnInit } from '@angular/core';
import { NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '@services/auth/auth.service';
import { OutpatientVisitsService } from '@services/dashboard/outpatient-visits/outpatient-visits.service';
import moment from 'moment';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-visit-op-list',
  templateUrl: './visit-op-list.component.html',
  styleUrl: './visit-op-list.component.scss'
})
export class VisitOpListComponent implements OnInit {
  modalRef:NgbModalRef;
  public isLoading: boolean = true;

  outpatient_visits: any[] = [];// Store fetched items
  totalItems = 0;     // Total number of items
  currentPage = 1;    // Current page number
  fromItems = 0; //from items
  toItems = 0; //to items
  perPage = 10;       // Items per page
  constructor(private outpatientVisitService:OutpatientVisitsService, private toastr: ToastrService, private service: AuthService) {
   
  }

  ngOnInit() {
    this.loadPage(1);
  }

  loadPage(page: number) {
    this.isLoading = true;
    this.outpatientVisitService.getOutpatientVisits(page).subscribe((result: any) => {
      console.log(result);
      this.isLoading = false;
      this.outpatient_visits = result.outpatient_visits.data;// Set the items
      this.totalItems = result.outpatient_visits.total; // Total number of items
      this.perPage = result.outpatient_visits.per_page; // Items per page
      this.currentPage = result.outpatient_visits.current_page; // Set the current page
      this.toItems = result.outpatient_visits.to; // Set to Items
      this.fromItems = result.outpatient_visits.from; // Set from Items
    }, error => {
      this.isLoading = false;
      console.log(error);
    });
  }


  formatDate(date: string) {
    return moment.utc(date).local().format('D MMMM, YYYY h:mma');
  }
}


